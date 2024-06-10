const express = require("express");
const router = express.Router();

const roleValidation = require("../middleware/roleValidation");

const Subscription = require("../models/Subscription.model");
const { Address } = require("../models/Address.model");
const { Payment } = require("../models/PaymentMethod.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET all subscriptions
router.get(
  "/",
  isAuthenticated,
  roleValidation(["admin"]),
  (req, res, next) => {
    Subscription.find()
      .then((subscriptions) => {
        res.status(200).json(subscriptions);
      })
      .catch((err) => next(err));
  }
);

// GET a single subscription by ID
router.get(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    Subscription.findById(req.params.id)
      .populate("user")
      .populate("mealplan")
      .populate("dishes")
      .then((dish) => {
        res.status(200).json(dish);
      })
      .catch((err) => next(err));
  }
);

// POST a new subscription
router.post(
  "/",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    // Destructure schemas to create separately
    const { shippingAddress, paymentMethod, user } = req.body;

    // try catch block
    try {
      const newSubscription = await Subscription.create(req.body);

      // find user
      const foundUser = await User.findById(user);

      // Add references
      newSubscription.shippingAddress.subscription = newSubscription._id;
      newSubscription.shippingAddress.user = foundUser._id;
      await newSubscription.shippingAddress.save();

      newSubscription.paymentMethod.subscription = newSubscription._id;
      newSubscription.paymentMethod.user = foundUser._id;
      await newSubscription.paymentMethod.save();

      foundUser.activeSubscription = newSubscription._id;
      foundUser.paymentMethod = newSubscription.paymentMethod._id;
      foundUser.address = newSubscription.shippingAddress._id;
      await foundUser.save();

      res.status(201).json(newSubscription);
    } catch (err) {
      next(err);
    }
  }
);

// PUT (replace) a subscription by ID
router.put(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    const { id } = req.params;

    Subscription.findByIdAndUpdate(id, req.body, { new: true })
      .then((updatedSubscription) => {
        res.status(200).json(updatedSubscription);
      })
      .catch((err) => next(err));
  }
);

// PATCH (update) a subscription by ID
router.patch(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    const { id } = req.params;

    Subscription.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((updatedSubscription) => {
        res.status(200).json(updatedSubscription);
      })
      .catch((err) => next(err));
  }
);

// DELETE a subscription by ID
router.delete(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    const { id } = req.params;

    Subscription.findByIdAndDelete(id)
      .then((deletedSubscription) => {
        res.status(200).json(deletedSubscription);
      })
      .catch((err) => next(err));
  }
);

module.exports = router;
