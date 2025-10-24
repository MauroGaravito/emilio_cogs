import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emilios';

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Ingredient.deleteMany({}),
    Recipe.deleteMany({}),
  ]);

  const salt = await bcrypt.genSalt(10);
  const [admin, user] = await User.insertMany([
    {
      name: 'Admin User',
      email: 'm.garavito82@gmail.com',
      password: await bcrypt.hash('123456', salt),
      role: 'admin',
    },
    {
      name: 'Viewer User',
      email: 'user@emilios.com',
      password: await bcrypt.hash('123456', salt),
      role: 'user',
    },
  ]);

  console.log('Users seeded:', admin.email, user.email);

  const [tomato, pasta, parmesan] = await Ingredient.insertMany([
    { name: 'Tomato', unit: 'kg', unitCost: 3.5, supplier: 'Bidfood' },
    { name: 'Pasta', unit: 'kg', unitCost: 2.2, supplier: 'Bidfood' },
    { name: 'Parmesan', unit: 'kg', unitCost: 12.0, supplier: 'PFD' },
  ]);

  console.log('Ingredients seeded:', tomato.name, pasta.name, parmesan.name);

  const recipe = new Recipe({
    name: 'Spaghetti Pomodoro',
    category: 'Pasta',
    yield: 4,
    ingredients: [
      { name: 'Tomato', qty: 0.8, unit: 'kg' },
      { name: 'Pasta', qty: 0.5, unit: 'kg' },
      { name: 'Parmesan', qty: 0.1, unit: 'kg' },
    ],
    laborCost: 5,
    sellingPrice: 28,
  });

  // Calculate costs using ingredient catalog
  let ingredientsCost = 0;
  for (const item of recipe.ingredients) {
    const ing = await Ingredient.findOne({ name: item.name });
    const cost = (ing?.unitCost || 0) * (item.qty || 0);
    item.cost = cost;
    ingredientsCost += cost;
  }
  recipe.totalCost = ingredientsCost + (recipe.laborCost || 0);
  recipe.margin = Number(
    (((recipe.sellingPrice - recipe.totalCost) / recipe.sellingPrice) * 100).toFixed(2)
  );

  await recipe.save();

  console.log('Recipe seeded:', recipe.name);

  await mongoose.disconnect();
  console.log('Seeding complete.');
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
