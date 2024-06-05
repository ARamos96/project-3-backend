const validateDish = (req, res, next) => {
  const validateSingleDish = (dish) => {
    const {
      name,
      ingredients,
      price,
      cookingTime,
      difficulty,
      categories,
      allergens,
      steps,
      rating,
      nutritionalValuePerServing,
    } = dish;

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

    const missingFields = requiredFields.filter((field) => !dish[field]);

    if (missingFields.length > 0) {
      return `Dish "${name}" is missing required fields: ${missingFields.join(
        ", "
      )}.`;
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return `Dish "${name}" ingredients must be a non-empty array.`;
    }

    if (typeof price !== "number" || price <= 0) {
      return `Dish "${name}" price is not valid.`;
    }

    if (typeof cookingTime !== "number" || cookingTime <= 0) {
      return `Dish "${name}" cooking time is not valid.`;
    }

    if (!difficultyOptions.includes(difficulty)) {
      return `Dish "${name}" difficulty is not valid.`;
    }

    if (
      !categories ||
      !categories.origin ||
      !Array.isArray(categories.origin) ||
      categories.origin.some((origin) => !originOptions.includes(origin))
    ) {
      return `Dish "${name}" origin categories are not valid.`;
    }

    if (
      !categories.diet ||
      !Array.isArray(categories.diet) ||
      categories.diet.some((diet) => !dietOptions.includes(diet))
    ) {
      return `Dish "${name}" diet categories are not valid.`;
    }

    if (!cookingTimeOptions.includes(categories.cookingTime)) {
      return `Dish "${name}" cooking time category is not valid.`;
    }

    if (typeof categories.isHot !== "boolean") {
      return `Dish "${name}" isHot category must be a boolean.`;
    }

    if (
      !Array.isArray(categories.allergens) ||
      categories.allergens.some(
        (allergen) => !allergenOptions.includes(allergen)
      )
    ) {
      return `Dish "${name}" allergens are not valid.`;
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return `Dish "${name}" steps must be a non-empty array.`;
    }

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return `Dish "${name}" rating is not valid.`;
    }

    if (nutritionalValuePerServing) {
      const {
        calories,
        fat,
        protein,
        carbohydrates,
        carbsOfWhichSugars,
        fiber,
      } = nutritionalValuePerServing;

      if (typeof calories !== "number" || calories < 0) {
        return `Dish "${name}" nutritional value calories is not valid.`;
      }

      if (typeof fat !== "number" || fat < 0) {
        return `Dish "${name}" nutritional value fat is not valid.`;
      }

      if (typeof protein !== "number" || protein < 0) {
        return `Dish "${name}" nutritional value protein is not valid.`;
      }

      if (typeof carbohydrates !== "number" || carbohydrates < 0) {
        return `Dish "${name}" nutritional value carbohydrates is not valid.`;
      }

      if (
        carbsOfWhichSugars &&
        (typeof carbsOfWhichSugars !== "number" || carbsOfWhichSugars < 0)
      ) {
        return `Dish "${name}" nutritional value carbs of which sugars is not valid.`;
      }

      if (typeof fiber !== "number" || fiber < 0) {
        return `Dish "${name}" nutritional value fiber is not valid.`;
      }
    }

    return null;
  };

  const dishes = Array.isArray(req.body) ? req.body : [req.body];

  for (const dish of dishes) {
    const validationError = validateSingleDish(dish);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
  }

  next();
};

module.exports = {
  validateDish,
};
