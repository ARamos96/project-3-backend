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
  price: {
    type: Number,
    required: true
  },
  cookingTime: {
    type: Number,
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
      enum: [
        'Italian', 'Mexican', 'Indian', 'Turkish',
        'Chinese', 'Japanese', 'French', 'American', 'MiddleEastern',
        'Thai', 'Spanish', 'Greek', 'Korean', 'Vietnamese'
      ]
    },
    diet: {
      type: String,
      required: true,
      enum: [
        'Vegan', 'Vegetarian', 'Animal-protein', 'Pescatarian', 'Low-calories',
        'High-protein', 'Keto', 'Paleo', 'Gluten-free', 'Dairy-free'
      ]
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
    required: true,
    enum: [
      'Eggs', 'Dairy', 'Wheat', 'Soy', 'Peanuts', 'Tree nuts', 'Fish', 'Shellfish', 'Sesame'
    ]
  },
  steps: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  nutritionalValuePerServing: {
    calories: {
      type: Number,
      required: true
    },
    fat: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      required: true
    },
    carbohydrates: {
      type: Number,
      required: true
    },
    carbsOfWhichSugars: {
      type: Number,
      required: true
    },
    fiber: {
      type: Number,
      required: true
    }
  }
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
