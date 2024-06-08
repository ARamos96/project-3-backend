const express = require("express");
const router = express.Router();

const roleValidation = require("../middleware/roleValidation");

const MealPlan = require("../models/MealPlan.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET all mealplans
router.get("/", (req, res, next) => {
  MealPlan.find()
    .then((mealplans) => {
      res.status(200).json(mealplans);
    })
    .catch((err) => next(err));
});

// GET a single mealplan by ID
router.get("/:id", (req, res, next) => {
  MealPlan.findById(req.params.id)
    .then((mealplan) => {
      res.status(200).json(mealplan);
    })
    .catch((err) => next(err));
});

// POST a new mealplan
router.post("/", (req, res, next) => {
  MealPlan.create(req.body)
    .then((newMealPlan) => {
      res.status(201).json(newMealPlan);
    })
    .catch((err) => next(err));
});

// PUT (replace) a mealplan by ID
router.put("/:id", (req, res, next) => {
  const { id } = req.params;

  MealPlan.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedMealPlan) => {
      res.status(200).json(updatedMealPlan);
    })
    .catch((err) => next(err));
});

// PATCH (update) a mealplan by ID
router.patch("/:id", (req, res, next) => {
  const { id } = req.params;

  MealPlan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((updatedMealPlan) => {
      res.status(200).json(updatedMealPlan);
    })
    .catch((err) => next(err));
});

// DELETE a mealplan by ID
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  MealPlan.findByIdAndDelete(id)
    .then((deletedMealPlan) => {
      res.status(200).json(deletedMealPlan);
    })
    .catch((err) => next(err));
});

module.exports = router;
