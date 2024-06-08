const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const { PaymentSchema } = require("./PaymentMethod.model");
const { addressSchema } = require("./Address.model");

const subscriptionSchema = new Schema(
  {
    shippingAddress: {
      type: addressSchema,
      required: true,
    },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    mealPlan: { type: Schema.Types.ObjectId, ref: "MealPlan", required: true },
    deliveryDay: {
      type: [String],
      required: [true, "Delivery Day is required"],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Whatever",
      ],
    },
    paymentMethod: {
      type: PaymentSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = model("Subscription", subscriptionSchema);

module.exports = Subscription;
