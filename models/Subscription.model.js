const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const { PaymentSchema } = require("./PaymentMethod.model");

const subscriptionSchema = new Schema(
  {
    shippingAdress: {
      address: {
        type: String,
        required: [true, "Address is required."],
      },
      city: {
        type: String,
        required: [true, "City is required."],
      },
      region: {
        type: String,
        required: [true, "Region is required."],
      },
      zipCode: {
        type: String,
        required: [true, "ZipCode is required."],
      },
      country: {
        type: String,
        required: [true, "Country is required."],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required."],
      },
    },
    // ELIMINARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    //weeklyOrder: { type: Schema.Types.ObjectId, ref: "WeeklyOrder", required: true },

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
