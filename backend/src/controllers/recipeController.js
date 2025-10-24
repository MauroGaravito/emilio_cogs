import Recipe from '../models/Recipe.js';
import Ingredient from '../models/Ingredient.js';

const recalcRecipe = async (recipe) => {
  let ingredientsCost = 0;
  // Recompute ingredient cost from Ingredient catalog when possible
  for (const item of recipe.ingredients) {
    let cost = item.cost || 0;
    const ing = await Ingredient.findOne({ name: item.name });
    if (ing) {
      cost = (ing.unitCost || 0) * (item.qty || 0);
      item.unit = item.unit || ing.unit;
    }
    item.cost = cost;
    ingredientsCost += cost;
  }
  const labor = recipe.laborCost || 0;
  recipe.totalCost = ingredientsCost + labor;
  const sp = recipe.sellingPrice || 0;
  recipe.margin = sp > 0 ? Number((((sp - recipe.totalCost) / sp) * 100).toFixed(2)) : 0;
};

export const getRecipes = async (req, res) => {
  try {
    const items = await Recipe.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const item = await Recipe.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recalcRecipe(recipe);
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    Object.assign(recipe, req.body);
    await recalcRecipe(recipe);
    const saved = await recipe.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const item = await Recipe.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

