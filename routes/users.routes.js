const express = require("express");
const router = express.Router();

const roleValidation = require("../middleware/roleValidation");

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET all user
router.get("/", (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => next(err));
});

// GET a single user by ID
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((dish) => {
      res.status(200).json(dish);
    })
    .catch((err) => next(err));
});

// POST a new user
router.post("/", (req, res, next) => {
  User.create(req.body)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => next(err));
});

// PUT (replace) a user by ID
router.put("/:id", (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => next(err));
});

// PATCH (update) a user by ID
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => next(err));
});

// DELETE a user by ID
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((deletedUser) => {
      res.status(200).json(deletedUser);
    })
    .catch((err) => next(err));
});

module.exports = router;
