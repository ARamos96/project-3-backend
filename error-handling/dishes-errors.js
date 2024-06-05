const validateDish = (req, res, next) => {
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
  } = req.body;

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

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Dish is missing required fields: ${missingFields.join(", ")}.`,
    });
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res
      .status(400)
      .json({ message: "Dish ingredients must be a non-empty array." });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Dish price is not valid." });
  }

  if (typeof cookingTime !== "number" || cookingTime <= 0) {
    return res.status(400).json({ message: "Dish cooking time is not valid." });
  }

  if (!difficultyOptions.includes(difficulty)) {
    return res.status(400).json({ message: "Dish difficulty is not valid." });
  }

  if (
    !categories ||
    !categories.origin ||
    !Array.isArray(categories.origin) ||
    categories.origin.some((origin) => !originOptions.includes(origin))
  ) {
    return res
      .status(400)
      .json({ message: "Dish origin categories are not valid." });
  }

  if (
    !categories.diet ||
    !Array.isArray(categories.diet) ||
    categories.diet.some((diet) => !dietOptions.includes(diet))
  ) {
    return res
      .status(400)
      .json({ message: "Dish diet categories are not valid." });
  }

  if (!cookingTimeOptions.includes(categories.cookingTime)) {
    return res
      .status(400)
      .json({ message: "Dish cooking time category is not valid." });
  }

  if (typeof categories.isHot !== "boolean") {
    return res
      .status(400)
      .json({ message: "Dish isHot category must be a boolean." });
  }

  if (
    !Array.isArray(categories.allergens) ||
    categories.allergens.some((allergen) => !allergenOptions.includes(allergen))
  ) {
    return res.status(400).json({ message: "Dish allergens are not valid." });
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return res
      .status(400)
      .json({ message: "Dish steps must be a non-empty array." });
  }

  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Dish rating is not valid." });
  }

  if (nutritionalValuePerServing) {
    const { calories, fat, protein, carbohydrates, carbsOfWhichSugars, fiber } =
      nutritionalValuePerServing;

    if (typeof calories !== "number" || calories < 0) {
      return res
        .status(400)
        .json({ message: "Dish nutritional value calories is not valid." });
    }

    if (typeof fat !== "number" || fat < 0) {
      return res
        .status(400)
        .json({ message: "Dish nutritional value fat is not valid." });
    }

    if (typeof protein !== "number" || protein < 0) {
      return res
        .status(400)
        .json({ message: "Dish nutritional value protein is not valid." });
    }

    if (typeof carbohydrates !== "number" || carbohydrates < 0) {
      return res.status(400).json({
        message: "Dish nutritional value carbohydrates is not valid.",
      });
    }

    if (
      carbsOfWhichSugars &&
      (typeof carbsOfWhichSugars !== "number" || carbsOfWhichSugars < 0)
    ) {
      return res.status(400).json({
        message: "Dish nutritional value carbs of which sugars is not valid.",
      });
    }

    if (typeof fiber !== "number" || fiber < 0) {
      return res
        .status(400)
        .json({ message: "Dish nutritional value fiber is not valid." });
    }
  }

  next();
};

module.exports = {
  validateDish,
};
