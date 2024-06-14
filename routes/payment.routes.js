const express = require("express");
const router = express.Router();
const User = require("../models/User.model"); // Assuming User model is defined in models/User.js
const { Payment } = require("../models/PaymentMethod.model"); // Assuming PaymentMethod model is defined in models/PaymentMethod.js

// Patch payment method route
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const changedFields = req.body;

  try {
    // Update the payment method
    const updatedPaymentMethod = await Payment.findByIdAndUpdate(
      id,
      changedFields
    );
    res.status(200).json(updatedPaymentMethod);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
