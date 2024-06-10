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
// Request body includes full address object and payment method to be created
router.post(
  "/",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    // Destructure schemas to create separately
    const {
      shippingAddress,
      user,
      mealPlan,
      dishes,
      deliveryDay,
      paymentMethod,
    } = req.body;

    // try catch block
    try {
      // Create address and payment
      const [newAddress, newPayment] = await Promise.all([
        Address.create(shippingAddress),
        Payment.create(paymentMethod),
      ]);

      // Find user and add references
      const foundUser = await User.findById(user);
      if (!foundUser) {
        return res.status(404).json({ error: "User not found" });
      }

      newAddress.user = foundUser._id;
      newPayment.user = foundUser._id;
      foundUser.paymentMethod = newPayment._id;
      foundUser.address = newAddress._id;

      // Create new subscription
      const newSubscription = await Subscription.create({
        shippingAddress: newAddress._id,
        user,
        mealPlan,
        dishes,
        deliveryDay,
        paymentMethod: newPayment._id,
      });

      // Add subscription references
      foundUser.activeSubscription = newSubscription._id;
      newAddress.subscription = newSubscription._id;
      newPayment.subscription = newSubscription._id;

      // Save all changes
      await Promise.all([
        foundUser.save(),
        newAddress.save(),
        newPayment.save(),
      ]);

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

    /*
    Al borrar una subscription...

DELETE subscription id de address
DELETE subscription id de paymentMethod
DELETE subscription id (activeSubscription, previousSubscriptions) de user
    */

    Subscription.findByIdAndDelete(id)
      .then((deletedSubscription) => {
        res.status(200).json(deletedSubscription);
      })
      .catch((err) => next(err));
  }
);

module.exports = router;
