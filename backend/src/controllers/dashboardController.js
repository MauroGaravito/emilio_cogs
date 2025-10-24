import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';

export const getSummary = async (req, res) => {
  try {
    const [recipes, ingredients] = await Promise.all([
      Recipe.find({}, { margin: 1, totalCost: 1 }),
      Ingredient.countDocuments(),
    ]);
    const totalRecipes = recipes.length;
    const avgMargin = totalRecipes
      ? Number(
          (
            recipes.reduce((sum, r) => sum + (r.margin || 0), 0) / totalRecipes
          ).toFixed(2)
        )
      : 0;
    const totalCost = Number(
      recipes.reduce((sum, r) => sum + (r.totalCost || 0), 0).toFixed(2)
    );
    res.json({ totalRecipes, avgMargin, totalIngredients: ingredients, totalCost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
