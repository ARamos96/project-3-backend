const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const { PaymentSchema } = require("./PaymentMethod.model");
const { addressSchema } = require("./Address.model");

const subscriptionSchema = new Schema(
  {
    shippingAddress: { type: Schema.Types.ObjectId, ref: "Address" },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    mealPlan: { type: Schema.Types.ObjectId, ref: "MealPlan", required: true },

    dishes: [{ type: Schema.Types.ObjectId, ref: "Dish", required: true }],

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
    paymentMethod: { type: Schema.Types.ObjectId, ref: "Payment" },
  },
  {
    timestamps: true,
  }
);

const Subscription = model("Subscription", subscriptionSchema);

module.exports = Subscription;
