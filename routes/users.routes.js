const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const moment = require("moment");

const roleValidation = require("../middleware/roleValidation");

const User = require("../models/User.model");
const Dish = require("../models/Dish.model");

const Subscription = require("../models/Subscription.model");
const { Address } = require("../models/Address.model");
const { Payment } = require("../models/PaymentMethod.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const restrictedFields = require("../middleware/restrictedFields");

const populateUser = async (id) => {
  // Populate the user model
  const populatedUser = await User.findById(id)
    .populate("paymentMethod")
    .populate("address");

  // Populate the activeSubscription with nested fields
  if (populatedUser.activeSubscription) {
    populatedUser.activeSubscription = await Subscription.findById(
      populatedUser.activeSubscription
    )
      .populate("mealPlan")
      .populate("dishes")
      .populate("shippingAddress")
      .populate("paymentMethod");
  }

  // Populate the previousSubscriptions with nested fields
  if (
    populatedUser.previousSubscriptions &&
    populatedUser.previousSubscriptions.length
  ) {
    populatedUser.previousSubscriptions = await Promise.all(
      populatedUser.previousSubscriptions.map((subId) =>
        Subscription.findById(subId)
          .populate("mealPlan")
          .populate("dishes")
          .populate("shippingAddress")
          .populate("paymentMethod")
      )
    );
  }

  // Populate favDishes
  if (populatedUser.favDishes && populatedUser.favDishes.length) {
    populatedUser.favDishes = await Promise.all(
      populatedUser.favDishes.map((dishId) => Dish.findById(dishId))
    );
  }

  return populatedUser;
};

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
  async (req, res, next) => {
    // get user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const populatedUser = await populateUser(user._id.toString());

    // Check if the subscription is older than 7 days
    if (
      populatedUser?.activeSubscription &&
      moment().diff(
        moment(populatedUser.activeSubscription.createdAt),
        "days"
      ) > 7
    ) {
      // Move to previousSubscriptions and clear activeSubscription
      populatedUser.previousSubscriptions.push(
        populatedUser.activeSubscription._id
      );
      populatedUser.activeSubscription = null;
      await foundUser.save(); // Save the updated user document
    }

    res.status(200).json(populatedUser);
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

// POST a new address and link it to the user
router.post(
  "/:id/address",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    try {
      // Get user, return error if not found
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create address and link it to user
      const address = await Address.create(req.body);
      user.address = address._id;
      // Link user to new address
      address.user = user._id;
      await Promise.all([user.save(), address.save()]);

      //Return address
      return res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  }
);

// POST a new address and link it to the user
router.post(
  "/:id/payment",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    try {
      // Get user, return error if not found
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create payment and link it to user
      const payment = await Payment.create(req.body);
      user.payment = payment._id;
      // Link user to new payment
      payment.user = user._id;
      await Promise.all([user.save(), payment.save()]);

      //Return payment
      return res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }
);

// POST a new address and link it to the user
router.post(
  "/:id/address",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    try {
      // Get user, return error if not found
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create address and link it to user
      const address = await Address.create(req.body);
      user.address = address._id;
      // Link user to new address
      address.user = user._id;
      await Promise.all([user.save(), address.save()]);

      //Return address
      return res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  }
);

// POST a new address and link it to the user
router.post(
  "/:id/payment",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    try {
      // Get user, return error if not found
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create payment and link it to user
      const payment = await Payment.create(req.body);
      user.payment = payment._id;
      // Link user to new payment
      payment.user = user._id;
      await Promise.all([user.save(), payment.save()]);

      //Return payment
      return res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }
);

// POST dishes array and add/delete to the user favDishes array
router.post(
  "/:id/update-dishes",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    const { id } = req.params;
    const { dishes } = req.body; // Expecting dishIds to be an array of dish objects with _id

    if (!Array.isArray(dishes)) {
      return res.status(400).json({ message: "dishes should be an array" });
    }

    try {
      const user = await User.findById(id).select("favDishes");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Extract only the _id fields from dishes
      const newDishIds = dishes.map((dish) => dish._id);

      // Extract only the _id fields from favDishes, converting BSON object to string
      const currentFavDishesIds = user.favDishes.map((dish) =>
        dish._id.toString()
      );

      // Determine the dishes to remove
      const dishesToRemove = currentFavDishesIds.filter(
        (dishId) => !newDishIds.includes(dishId)
      );

      // Remove old dishes
      if (dishesToRemove.length > 0) {
        await User.findByIdAndUpdate(id, {
          $pull: { favDishes: { $in: dishesToRemove } },
        });
      }

      // Add new dishes without duplicates
      if (newDishIds.length > 0) {
        await User.findByIdAndUpdate(id, {
          $addToSet: { favDishes: { $each: newDishIds } },
        });
      }

      // Find the updated user and populate favDishes with dish objects
      const updatedUser = await User.findById(id).populate("favDishes");

      // Return the updated favDishes array
      res.status(200).json(updatedUser.favDishes);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id/fav-dishes",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.populate("favDishes");
      res.status(200).json(user.favDishes);
    } catch (error) {
      next(error);
    }
  }
);

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
  async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const populatedUser = await populateUser(user._id.toString());

    return res.status(200).json(populatedUser);
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
    let isValid = false;
    let message = "Error updating password";

    if (oldPassword === undefined || newPassword === undefined) {
      isValid = false;
    } else {
      isValid = bcrypt.compareSync(oldPassword, user.password);
    }

    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Previous password is not valid!" });
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

      // Remove all linked data
      await Promise.all([
        Subscription.findByIdAndDelete(user.activeSubscription),
        Payment.findByIdAndDelete(user.paymentMethod),
        Address.findByIdAndDelete(user.address),
      ]);

      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
