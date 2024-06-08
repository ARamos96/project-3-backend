const { Schema, model } = require("mongoose");

const addressSchema = new Schema({
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
  user: { type: Schema.Types.ObjectId, ref: "User" },
  subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
});

const Address = model("Address", addressSchema);

module.exports = { addressSchema, Address };
