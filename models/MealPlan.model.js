const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  numberOfPeople: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  numberOfServings: {
    type: Number,
    enum: [2, 3, 4, 5],
  },

});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
module.exports = MealPlan;