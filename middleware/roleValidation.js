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

  const missingFields = [];

  if (!name) missingFields.push("name");
  if (!Array.isArray(ingredients) || ingredients.length === 0)
    missingFields.push("ingredients");
  if (typeof price !== "number" || price <= 0) missingFields.push("price");
  if (typeof cookingTime !== "number" || cookingTime <= 0)
    missingFields.push("cookingTime");
  if (!difficultyOptions.includes(difficulty)) missingFields.push("difficulty");

  if (
    !categories ||
    !categories.origin ||
    !Array.isArray(categories.origin) ||
    categories.origin.some((origin) => !originOptions.includes(origin))
  ) {
    missingFields.push("categories.origin");
  }
  if (
    !categories.diet ||
    !Array.isArray(categories.diet) ||
    categories.diet.some((diet) => !dietOptions.includes(diet))
  ) {
    missingFields.push("categories.diet");
  }
  if (!cookingTimeOptions.includes(categories.cookingTime))
    missingFields.push("categories.cookingTime");
  if (typeof categories.isHot !== "boolean")
    missingFields.push("categories.isHot");

  if (
    !Array.isArray(allergens) ||
    allergens.some((allergen) => !allergenOptions.includes(allergen))
  ) {
    missingFields.push("allergens");
  }

  if (!Array.isArray(steps) || steps.length === 0) missingFields.push("steps");
  if (typeof rating !== "number" || rating < 0 || rating > 5)
    missingFields.push("rating");

  if (nutritionalValuePerServing) {
    const { calories, fat, protein, carbohydrates, carbsOfWhichSugars, fiber } =
      nutritionalValuePerServing;

    if (typeof calories !== "number" || calories < 0)
      missingFields.push("nutritionalValuePerServing.calories");
    if (typeof fat !== "number" || fat < 0)
      missingFields.push("nutritionalValuePerServing.fat");
    if (typeof protein !== "number" || protein < 0)
      missingFields.push("nutritionalValuePerServing.protein");
    if (typeof carbohydrates !== "number" || carbohydrates < 0)
      missingFields.push("nutritionalValuePerServing.carbohydrates");
    if (
      carbsOfWhichSugars &&
      (typeof carbsOfWhichSugars !== "number" || carbsOfWhichSugars < 0)
    ) {
      missingFields.push("nutritionalValuePerServing.carbsOfWhichSugars");
    }
    if (typeof fiber !== "number" || fiber < 0)
      missingFields.push("nutritionalValuePerServing.fiber");
  } else {
    missingFields.push("nutritionalValuePerServing");
  }

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({
        message: `Dish is missing or has invalid required fields: ${missingFields.join(
          ", "
        )}.`,
      });
  }

  next();
};

module.exports = {
  validateDish,
};
