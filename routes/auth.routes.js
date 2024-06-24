const express = require("express");
const router = express.Router();
const moment = require("moment");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the models in order to interact with the database
const User = require("../models/User.model");
const { Address } = require("../models/Address.model");
const Subscription = require("../models/Subscription.model");
const Dish = require("../models/Dish.model");
const { Payment } = require("../models/PaymentMethod.model");
const MealPlan = require("../models/MealPlan.model.js");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name, lastName, contactInformation, phone, role } =
    req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({
        email,
        password: hashedPassword,
        name,
        lastName,
        contactInformation,
        phone,
        role,
      });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id, role } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id, role };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty strings
  if (email === "" || password === "") {
    return res.status(400).json({ message: "Provide email and password." });
  }

  try {
    // Check the users collection if a user with the same email exists
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      // If the user is not found, send an error response
      return res.status(401).json({ message: "User not found." });
    }

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      // Populate the user model
      let populatedUser = await User.findById(foundUser._id)
        .populate("paymentMethod")
        .populate("address");

      // Populate the activeSubscription with nested fields
      if (populatedUser.activeSubscription) {
        let activeSubscription = await Subscription.findById(
          populatedUser.activeSubscription
        )
          .populate("mealPlan")
          .populate("dishes")
          .populate("shippingAddress")
          .populate("paymentMethod");

        // Check if the subscription is older than 7 days
        if (moment().diff(moment(activeSubscription.createdAt), "days") > 7) {
          // Move to previousSubscriptions and clear activeSubscription
          populatedUser.previousSubscriptions.push(activeSubscription._id);
          populatedUser.activeSubscription = null;
          await populatedUser.save(); // Save the updated user document

          // Populate the previousSubscriptions with nested fields
          populatedUser.previousSubscriptions = await Promise.all(
            populatedUser.previousSubscriptions.map((subId) =>
              Subscription.findById(subId)
                .populate("mealPlan")
                .populate("dishes")
                .populate("shippingAddress")
                .populate("paymentMethod")
            )
          );
        } else {
          populatedUser.activeSubscription = activeSubscription;
        }
      }

      // Populate the previousSubscriptions with nested fields if not already populated
      if (
        populatedUser.previousSubscriptions &&
        populatedUser.previousSubscriptions.length
      ) {
        populatedUser.previousSubscriptions = await Promise.all(
          populatedUser.previousSubscriptions.map((subId) =>
            Subscription.findById(subId)
              .populate("mealPlan")
              .populate("dishes")
              .populate("shippingAddress")
              .populate("paymentMethod")
          )
        );
      }

      // Populate favDishes
      if (populatedUser.favDishes && populatedUser.favDishes.length) {
        populatedUser.favDishes = await Promise.all(
          populatedUser.favDishes.map((dishId) => Dish.findById(dishId))
        );
      }

      // Create an object that will be set as the token payload
      const payload = {
        _id: populatedUser._id,
        email: populatedUser.email,
        name: populatedUser.name,
        lastName: populatedUser.lastName,
        role: populatedUser.role,
        activeSubscription: populatedUser.activeSubscription,
        previousSubscriptions: populatedUser.previousSubscriptions,
        favDishes: populatedUser.favDishes,
        paymentMethod: populatedUser.paymentMethod,
        address: populatedUser.address,
      };

      // Create a JSON Web Token and sign it
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      // Send the token as the response
      return res.status(200).json({ authToken: authToken });
    } else {
      return res
        .status(401)
        .json({ message: "Unable to authenticate the user" });
    }
  } catch (err) {
    return next(err); // In this case, we send error handling to the error handling middleware.
  }
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  // console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

//Delete /auth/user/:userId - Delete an existing user

router.delete("/user/:userId", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => next(err));
});

module.exports = router;
