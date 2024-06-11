const express = require("express");
const router = express.Router();

const roleValidation = require("../middleware/roleValidation");

const User = require("../models/User.model");
const Subscription = require("../models/Subscription.model");
const { Address } = require("../models/Address.model");
const { Payment } = require("../models/PaymentMethod.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const restrictedFields = require("../middleware/restrictedFields");

// GET all users
router.get(
  "/",
  isAuthenticated,
  roleValidation(["admin"]),
  (req, res, next) => {
    User.find()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  }
);

// GET a single user by ID
router.get(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    User.findById(req.params.id)
      .then((dish) => {
        res.status(200).json(dish);
      })
      .catch((err) => next(err));
  }
);

// POST a new user
router.post("/", restrictedFields(["role"]), (req, res, next) => {
  User.create(req.body)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => next(err));
});

// PUT (replace) a user by ID
router.put(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  restrictedFields(["role"]),
  (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndUpdate(id, req.body, { new: true })
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => next(err));
  }
);

// PATCH (update) a user by ID
router.patch(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  restrictedFields(["role", "password"]),
  (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => next(err));
  }
);

// PATCH a password by ID. Request body includes old password and new password
router.patch(
  "/:id/password",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Previous password is not valid" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json(user);
  }
);

// DELETE a user by ID
router.delete(
  "/:id",
  isAuthenticated,
  roleValidation(["admin"]),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove references from subscription.
      //Previous subscriptions remain in database
      const subscription = await Subscription.findById(user.activeSubscription);

      if (subscription) {
        subscription.user = null;
        await subscription.save();
      }

      if (user.paymentMethod) {
        const payment = await Payment.findById(user.paymentMethod);
        payment.user = null;
        await payment.save();
      }

      if (user.address) {
        const address = await Address.findById(user.address);
        address.user = null;
        await address.save();
      }

      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } catch {
      next(err);
    }
  }
);

module.exports = router;
