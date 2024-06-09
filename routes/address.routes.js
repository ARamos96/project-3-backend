const roleValidation = require("../middleware/roleValidation");

const express = require("express");

// Destructure from the export at Address.model
const { Address } = require("../models/Address.model");

const router = express.Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");

const User = require("../models/User.model");

// Create a new Address with Post method

router.post("/", (req, res, next) => {
  Address.create(req.body)
    .then((newAddress) => {
      res.status(201).json(newAddress);
    })
    .catch((err) => next(err));
});

// Get all Addresses with Get method
router.get("/", (req, res, next) => {
  Address.find()
    .then((allAddresses) => {
      res.status(200).json(allAddresses);
    })
    .catch((err) => next(err));
});

//Get one address
router.get("/:id", (req, res, next) => {
  Address.findById(req.params.id)
    .populate(user)
    .populate(subscription)

    .then((oneAddress) => {
      res.status(200).json(oneAddress);
    })
    .catch((err) => next(err));
});

// Edit address
router.put("/:id", (req, res, next) => {
  Address.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedAddress) => {
      res.status(200).json(updatedAddress);
    })
    .catch((err) => next(err));
});

// Update address
router.patch("/:id", (req, res, next) => {
  Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedAddress) => {
      res.status(200).json(updatedAddress);
    })
    .catch((err) => next(err));
});

module.exports = router;
