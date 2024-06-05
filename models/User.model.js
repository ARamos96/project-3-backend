const { Schema, model } = require("mongoose");

<<<<<<< Updated upstream
// TODO: Please make sure you edit the User model to whatever makes sense in this case
=======
const { categoriesSchema } = require("./Categories.model");

>>>>>>> Stashed changes
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
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
