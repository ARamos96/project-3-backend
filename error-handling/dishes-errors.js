const difficultyOptions = ["easy", "medium", "hard"];

const originOptions = [
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
];

const dietOptions = [
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
];

const cookingTimeOptions = ["Fast", "Normal", "Slow"];

const allergenOptions = [
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
];

const requiredFields = [
  "name",
  "ingredients",
  "price",
  "cookingTime",
  "difficulty",
  "categories",
  "steps",
  "rating",
  "nutritionalValuePerServing",
];

// Field validator functions
const validateRequiredFields = (dish) => {
  const missingFields = requiredFields.filter((field) => !dish[field]);
  if (missingFields.length > 0) {
    return `Dish "${dish.name}" is missing required fields: ${missingFields.join(
      ", "
    )}.`;
  }
  return null;
};

const checkName = (name) => {
  if (typeof name !== "string" || name.length === 0) {
    return `Dish name is not valid.`;
  }
  return null;
};

const checkIngredients = (ingredients) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return `Ingredients must be a non-empty array.`;
  }
  return null;
};

const checkPrice = (price) => {
  if (typeof price !== "number" || price <= 0) {
    return `Price is not valid.`;
  }
  return null;
};

const checkCookingTime = (cookingTime) => {
  if (typeof cookingTime !== "number" || cookingTime <= 0) {
    return `Cooking time is not valid.`;
  }
  return null;
};

const checkDifficulty = (difficulty) => {
  if (!difficultyOptions.includes(difficulty.toLowerCase())) {
    return `Difficulty is not valid.`;
  }
  return null;
};

const checkCategories = (categories) => {
  if (
    !categories ||
    !categories.origin ||
    !Array.isArray(categories.origin) ||
    categories.origin.some((origin) => !originOptions.includes(origin))
  ) {
    return `Origin categories are not valid.`;
  }

  if (
    !categories.diet ||
    !Array.isArray(categories.diet) ||
    categories.diet.some((diet) => !dietOptions.includes(diet))
  ) {
    return `Diet categories are not valid.`;
  }

  if (!cookingTimeOptions.includes(categories.cookingTime)) {
    return `Cooking time category is not valid.`;
  }

  if (typeof categories.isHot !== "boolean") {
    return `IsHot category must be a boolean.`;
  }

  if (
    !Array.isArray(categories.allergens) ||
    categories.allergens.some((allergen) => !allergenOptions.includes(allergen))
  ) {
    return `Allergens are not valid.`;
  }
  return null;
};

const checkSteps = (steps) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return `Steps must be a non-empty array.`;
  }
  return null;
};

const checkRating = (rating) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return `Rating is not valid.`;
  }
  return null;
};

const checkNutritionalValue = (nutritionalValuePerServing) => {
  if (nutritionalValuePerServing) {
    const { calories, fat, protein, carbohydrates, carbsOfWhichSugars, fiber } =
      nutritionalValuePerServing;

    if (typeof calories !== "number" || calories < 0) {
      return `Nutritional value calories is not valid.`;
    }

    if (typeof fat !== "number" || fat < 0) {
      return `Nutritional value fat is not valid.`;
    }

    if (typeof protein !== "number" || protein < 0) {
      return `Nutritional value protein is not valid.`;
    }

    if (typeof carbohydrates !== "number" || carbohydrates < 0) {
      return `Nutritional value carbohydrates is not valid.`;
    }

    if (
      carbsOfWhichSugars &&
      (typeof carbsOfWhichSugars !== "number" || carbsOfWhichSugars < 0)
    ) {
      return `Nutritional value carbs of which sugars is not valid.`;
    }

    if (typeof fiber !== "number" || fiber < 0) {
      return `Nutritional value fiber is not valid.`;
    }
  }
  return null;
};

const validateSingleDish = (dish, fieldsToValidate = null) => {
  const validators = {
    name: checkName,
    ingredients: checkIngredients,
    price: checkPrice,
    cookingTime: checkCookingTime,
    difficulty: checkDifficulty,
    categories: checkCategories,
    steps: checkSteps,
    rating: checkRating,
    nutritionalValuePerServing: checkNutritionalValue,
  };

  const fields = fieldsToValidate || requiredFields;

  for (const field of fields) {
    const validator = validators[field];
    if (validator) {
      const error = validator(dish[field]);
      if (error) {
        return `Dish "${dish.name}" ${error}`;
      }
    }
  }

  return null;
};

const validateDish = (req, res, next) => {
  const dishes = Array.isArray(req.body) ? req.body : [req.body];

  for (const dish of dishes) {
    let validationError;

    if (req.method === "POST") {
      validationError = validateSingleDish(dish);
    } else if (req.method === "PATCH") {
      const fieldsToValidate = Object.keys(dish);
      validationError = validateSingleDish(dish, fieldsToValidate);
    }

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
  }

  next();
};

module.exports = {
  validateDish,
};
