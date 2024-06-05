const express = require("express");
const router = express.Router();

const { validateDish } = require("./../error-handling/dishes-errors");

const Dish = require("../models/Dish.model");

// GET all dishes
router.get("/", (req, res, next) => {
  Dish.find()
    .then((dishes) => {
      res.status(200).json(dishes);
    })
    .catch((err) => next(err));
});

// GET a single dish by ID
router.get("/:id", (req, res, next) => {
  Dish.findById(req.params.id)
    .then((dish) => {
      res.status(200).json(dish);
    })
    .catch((err) => next(err));
});

// POST a new dish
router.post("/", validateDish, (req, res, next) => {
  Dish.create(req.body)
    .then((newDish) => {
      res.status(201).json(newDish);
    })
    .catch((err) => next(err));
});

// PUT (replace) a dish by ID
router.put("/:id", (req, res, next) => {
  const { id } = req.params;

  Dish.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedDish) => {
      res.status(200).json(updatedDish);
    })
    .catch((err) => next(err));
});

// PATCH (update) a dish by ID
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;

  Dish.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((updatedDish) => {
      res.status(200).json(updatedDish);
    })
    .catch((err) => next(err));
});

// DELETE a dish by ID
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Dish.findByIdAndDelete(id)
    .then((deletedDish) => {
      res.status(200).json(deletedDish);
    })
    .catch((err) => next(err));
});

module.exports = router;
