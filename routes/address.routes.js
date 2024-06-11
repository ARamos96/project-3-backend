const roleValidation = require("../middleware/roleValidation");

const express = require("express");

// Destructure from the export at Address.model
const { Address } = require("../models/Address.model");

const router = express.Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");

const User = require("../models/User.model");
const Subscription = require("../models/Subscription.model");

// Create a new Address with Post method from user dashboard
// When subscription is created with new address,
// it is created from subscription route

router.post(
  "/",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    Address.create(req.body)
      .then((newAddress) => {
        res.status(201).json(newAddress);
      })
      .catch((err) => next(err));
  }
);

// Get all Addresses with Get method
router.get(
  "/",
  isAuthenticated,
  roleValidation(["admin"]),
  (req, res, next) => {
    Address.find()
      .then((allAddresses) => {
        res.status(200).json(allAddresses);
      })
      .catch((err) => next(err));
  }
);

//Get one address
router.get(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    Address.findById(req.params.id)
      .populate("user")
      .populate("subscription")
      .then((oneAddress) => {
        res.status(200).json(oneAddress);
      })
      .catch((err) => next(err));
  }
);

// Edit address
router.put(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    Address.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((updatedAddress) => {
        res.status(200).json(updatedAddress);
      })
      .catch((err) => next(err));
  }
);

// Update address
router.patch(
  "/:id",
  isAuthenticated,
  roleValidation(["admin", "user"]),
  (req, res, next) => {
    Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((updatedAddress) => {
        res.status(200).json(updatedAddress);
      })
      .catch((err) => next(err));
  }
);

router.delete(
  "/:id",
  roleValidation(["admin", "user"]),
  async (req, res, next) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      // Delete references to address from user and subscription

      const user = await User.findById(address.user);
      if (user) {
        user.address = null;
        await user.save();
      }

      const subscription = await Subscription.findById(address.subscription);
      if (subscription) {
        subscription.shippingAddress = null;
        await subscription.save();
      }

      await address.remove();
      res.status(200).json({ message: "Address deleted" });
    } catch {
      next(err);
    }
  }
);

module.exports = router;
