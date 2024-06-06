const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const mealPlanSchema = new Schema({
  numberOfPeople: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
    default: 2,
  },
  dishesPerWeek: {
    type: Number,
    enum: [2, 3, 4, 5],
    required: true,
    default: 4,
  },
  price: {
    type: Number,
    required: true,
  },

  diet: {
    type: [String],
    required: true,
    enum: [
      "Vegan",
      "Vegetarian",
      "Animal-protein",
      "Pescatarian",
      "Low-calories",
      "High-protein",
      "Keto",
      "Paleo",
      "Gluten-free",
      "Dairy-free",
    ],
  },

  dishes: [{ type: Schema.Types.ObjectId, ref: "Dish", required: true }],
});

const MealPlan = model("MealPlan", mealPlanSchema);
module.exports = MealPlan;
