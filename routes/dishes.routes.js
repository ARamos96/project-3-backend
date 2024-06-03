const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware");

const { validateDish } = require("./../error-handling/dishes-errors");

const roleValidation = require("../middleware/roleValidation");

const Dish = require("../models/Dish.model");

router.get("/", (req, res, next) => {
  Dish.find()
    .then((dish) => {
      res.json(dish);
    })
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  Dish.findById(req.params.id)
    .then((dish) => {
      res.json(dish);
    })
    .catch((err) => next(err));
});

router.post("/", validateDish, (req, res, next) => {
  Dish.create(req.body)
    .then((newDish) => {
      res.json(newDish);
    })
    .catch((err) => next(err));
});

router.put("/:id", (req, res, next) => {
  const { id } = req.params;

  Dish.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedDish) => {
      res.json(updatedDish);
    })
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Dish.findByIdAndDelete(id)
    .then((deletedDish) => {
      res.json(deletedDish);
    })
    .catch((err) => next(err));
});

module.exports = router;
