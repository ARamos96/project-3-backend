const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    lastName: {
      type: String,
      required: [true, "LastName is required."],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      default: "user",
      enum: ["user", "admin"],
    },
    activeSubscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
    previousSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription" },
    ],
    favDishes: [{ type: Schema.Types.ObjectId, ref: "Dish" }],
    paymentMethod: { type: Schema.Types.ObjectId, ref: "Payment" },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
