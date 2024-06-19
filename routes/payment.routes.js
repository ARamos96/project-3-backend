const express = require("express");
const router = express.Router();
const User = require("../models/User.model"); // Assuming User model is defined in models/User.js
const { Payment } = require("../models/PaymentMethod.model"); // Assuming PaymentMethod model is defined in models/PaymentMethod.js

// Patch payment method route
router.patch("/:id", async (req, res, next) => {
  Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedPayment) => {
      res.status(200).json(updatedPayment);
    })
    .catch((err) => next(err));
});

module.exports = router;
