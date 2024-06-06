const { Schema, model } = require("mongoose");


const { categoriesSchema } = require("./Categories.model");

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
    categories: {
      type: categoriesSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

