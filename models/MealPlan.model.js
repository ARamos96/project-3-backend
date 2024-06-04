const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  numberOfPeople: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
    default: 2,
  },
  numberOfServings: {
    type: Number,
    enum: [2, 3, 4, 5],
    required: true,
    default: 4,
  },
  price: {
    type: Number,
    required: true,
  },
});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
module.exports = MealPlan;
