const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema({
  origin: {
    type: [String],
    required: true,
    enum: [
      "Italian",
      "Mexican",
      "Indian",
      "Turkish",
      "Chinese",
      "Japanese",
      "French",
      "American",
      "MiddleEastern",
      "Thai",
      "Spanish",
      "Greek",
      "Korean",
      "Vietnamese",
    ],
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
  cookingTime: {
    type: String,
    required: true,
    enum: ["Fast", "Normal", "Slow"],
  },
  isHot: {
    type: Boolean,
    required: true,
  },
  allergens: {
    type: [String],
    required: true,
    enum: [
      "Eggs",
      "Dairy",
      "Wheat",
      "Soy",
      "Peanuts",
      "Tree nuts",
      "Fish",
      "Shellfish",
      "Sesame",
      "None",
    ],
  },
});

const Category = model("Category", categoriesSchema);
module.exports = { categoriesSchema, Category };
