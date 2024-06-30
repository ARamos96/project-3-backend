const express = require("express");
const router = express.Router();

const roleValidation = require("../middleware/roleValidation");

const Subscription = require("../models/Subscription.model");
const { Address } = require("../models/Address.model");
const { Payment } = require("../models/PaymentMethod.model");
const User = require("../models/User.model");
const MealPlan = require("../models/MealPlan.model");
const Dish = require("../models/Dish.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const restrictedFields = require("../middleware/restrictedFields");

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
      .populate("mealPlan")
      .populate("dishes")
      .populate("shippingAddress")
      .populate("paymentMethod")
      .then((subscription) => {
        res.status(200).json(subscription);
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

    let hasToPutUserAddress = false;
    let hasToPutUserPaymentMethod = false;

    let hasToPostUserAddress = false;
    let hasToPostUserPaymentMethod = false;

    // Flag booleans in case of put or post requests to user
    if (shippingAddress.postPaymentToUser) {
      delete shippingAddress.postPaymentToUser;
      hasToPostUserAddress = true;
    }

    if (shippingAddress.putPaymentToUser) {
      delete shippingAddress.putPaymentToUser;
      hasToPutUserAddress = true;
    }

    // Flag booleans in case of put or post requests to user
    if (paymentMethod.postAddressToUser) {
      delete paymentMethod.postAddressToUser;
      hasToPostUserPaymentMethod = true;
    }

    if (paymentMethod.putAddressToUser) {
      delete paymentMethod.putAddressToUser;
      hasToPutUserPaymentMethod = true;
    }

    try {
      // Create new address and payment that will be independent of user
      const [newAddress, newPayment] = await Promise.all([
        Address.create(shippingAddress),
        Payment.create(paymentMethod),
      ]);

      // Find user
      const foundUser = await User.findById(user);
      if (!foundUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create new meal plan and link to user
      const newMealPlan = await MealPlan.create({
        ...mealPlan,
        user: foundUser._id,
      });
      if (!newMealPlan) {
        return res.status(404).json({ error: "Error creating meal plan" });
      }

      // Create new subscription
      let newSubscription = await Subscription.create({
        shippingAddress: newAddress._id,
        user: foundUser._id,
        mealPlan: newMealPlan._id,
        dishes,
        deliveryDay,
        paymentMethod: newPayment._id,
      });

      // Add subscription references to user
      foundUser.activeSubscription = newSubscription._id;

      // Add subscription references to new address and payment method
      newAddress.subscription = newSubscription._id;
      newPayment.subscription = newSubscription._id;

      // If user has to post a new address, create a new independent address
      if (hasToPostUserAddress) {
        foundUser.address = await Address.create(shippingAddress);
      }

      // If user has to put an existing address, update user address
      if (hasToPutUserAddress) {
        foundUser.address = await Address.findByIdAndUpdate(
          foundUser.address._id,
          shippingAddress,
          { new: true }
        );
      }

      // If user has to post a new payment method, create a new independent payment
      if (hasToPostUserPaymentMethod) {
        foundUser.paymentMethod = await Payment.create(paymentMethod);
      }

      // If user has to put an existing payment method, update user payment method
      if (hasToPutUserPaymentMethod) {
        foundUser.paymentMethod = await Payment.findByIdAndUpdate(
          foundUser.paymentMethod._id,
          paymentMethod,
          { new: true }
        );
      }

      // Save all changes
      await Promise.all([
        foundUser.save(),
        newAddress.save(),
        newPayment.save(),
      ]);

      // Populate and return newly created subscription
      newSubscription = Subscription.findById(newSubscription._id)
        .populate("user")
        .populate("mealPlan")
        .populate("dishes")
        .populate("shippingAddress")
        .populate("paymentMethod")
        .then((populatedSubscription) => {
          res.status(201).json(populatedSubscription);
        });
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
  restrictedFields([
    "_id",
    "shippingAddress",
    "user",
    "mealPlan",
    "paymentMethod",
  ]),
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

// DELETE a subscription by ID -
// remove references from user, address and payment
router.delete(
  "/:id",
  isAuthenticated,
  roleValidation(["admin"]),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const subscription = await Subscription.findById(id);
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // Remove references from user, address and payment
      const user = await User.findById(subscription.user);
      if (user) {
        user.activeSubscription = null;
        await user.save();
      }

      const address = await Address.findById(subscription.shippingAddress);
      if (address) {
        address.subscription = null;
        await address.save();
      }

      const payment = await Payment.findById(subscription.paymentMethod);
      if (payment) {
        payment.subscription = null;
        await payment.save();
      }

      await Subscription.findByIdAndDelete(id);

      res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
