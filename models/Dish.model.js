const mongoose = require("mongoose");

const { Schema, model } = mongoose;

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
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
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
});

const Dish = model("Dish", dishSchema);

module.exports = Dish;
