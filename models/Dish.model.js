const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  time_of_cooking: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  categories: {
    origin: {
      type: String,
      required: true,
      enum: ['Italian', 'SoutheastAsian', 'Mediterranean', 'Mexican']
    },
    diet: {
      type: String,
      required: true,
      enum: ['Vegan', 'Non-vegetarian', 'Carnivore']
    },
    cookingTime: {
      type: String,
      required: true,
      enum: ['Fast', 'Normal', 'Slow']
    },
    isHot: {
      type: Boolean,
      required: true
    }
  },
  allergens: {
    type: [String],
    required: true
  },
  steps: {
    type: [String],
    required: true
  }
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
