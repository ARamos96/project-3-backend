const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const { categoriesSchema } = require("./Categories.model");

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  categories: {
    type: categoriesSchema,
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  nutritionalValuePerServing: {
    calories: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbohydrates: {
      type: Number,
      required: true,
    },
    carbsOfWhichSugars: {
      type: Number,
    },
    fiber: {
      type: Number,
      required: true,
    },
  },
  bigImageURL: {
    type: String,
    default: "https://placehold.co/600x400?text=Hello\nDish",
    required: true,
  },
  smallImageURL: {
    type: String,
    default: "https://placehold.co/100x100",
    required: true,
  },
});

const Dish = model("Dish", dishSchema);

module.exports = Dish;
