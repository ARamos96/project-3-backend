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
    contactInformation: {
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
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      default: "user",
      enum: ["user", "admin"] 
    }
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

