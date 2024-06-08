const express = require("express");
const router = express.Router();

const roleValidation = require("../middleware/roleValidation");

const Subscription = require("../models/Subscription.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET all subscriptions
router.get("/", (req, res, next) => {
  Subscription.find()
    .then((subscriptions) => {
      res.status(200).json(subscriptions);
    })
    .catch((err) => next(err));
});

// GET a single subscription by ID
router.get("/:id", (req, res, next) => {
  Subscription.findById(req.params.id)
    .then((dish) => {
      res.status(200).json(dish);
    })
    .catch((err) => next(err));
});

// POST a new subscription
router.post("/", (req, res, next) => {
  Subscription.create(req.body)
    .then((newSubscription) => {
      res.status(201).json(newSubscription);
    })
    .catch((err) => next(err));
});

// PUT (replace) a subscription by ID
router.put("/:id", (req, res, next) => {
  const { id } = req.params;

  Subscription.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedSubscription) => {
      res.status(200).json(updatedSubscription);
    })
    .catch((err) => next(err));
});

// PATCH (update) a subscription by ID
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;

  Subscription.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((updatedSubscription) => {
      res.status(200).json(updatedSubscription);
    })
    .catch((err) => next(err));
});

// DELETE a subscription by ID
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Subscription.findByIdAndDelete(id)
    .then((deletedSubscription) => {
      res.status(200).json(deletedSubscription);
    })
    .catch((err) => next(err));
});

module.exports = router;
