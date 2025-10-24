import mongoose from 'mongoose';

const recipeIngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    unit: { type: String, required: true },
    cost: { type: Number, default: 0 },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  yield: { type: Number, default: 1 },
  ingredients: [recipeIngredientSchema],
  laborCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  margin: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Recipe', recipeSchema);

