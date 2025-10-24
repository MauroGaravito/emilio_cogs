import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  unitCost: { type: Number, required: true },
  supplier: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model('Ingredient', ingredientSchema);

