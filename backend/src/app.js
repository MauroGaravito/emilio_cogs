import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJSExpress from '@adminjs/express';

import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import User from './models/User.js';
import Ingredient from './models/Ingredient.js';
import Recipe from './models/Recipe.js';
import bcrypt from 'bcryptjs';

dotenv.config();

AdminJS.registerAdapter({ Resource: AdminJSMongoose.Resource, Database: AdminJSMongoose.Database });

const app = express();

// Core middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());

// API routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/dashboard', dashboardRoutes);

// AdminJS setup (only admins can login)
const admin = new AdminJS({
  branding: {
    companyName: "Emilio's COGS",
  },
  rootPath: '/admin',
  resources: [User, Ingredient, Recipe],
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
      if (!user || user.role !== 'admin') return null;
      const ok = await bcrypt.compare(password, user.password);
      return ok ? { email: user.email, role: user.role, name: user.name, id: user._id } : null;
    },
    cookieName: 'adminjs',
    cookiePassword: process.env.ADMINJS_COOKIE_SECRET || process.env.JWT_SECRET || 'adminjs-secret',
  },
  null,
  {
    // cookie/session options
    resave: false,
    saveUninitialized: false,
    secret: process.env.ADMINJS_COOKIE_SECRET || process.env.JWT_SECRET || 'adminjs-secret',
  }
);

app.use(admin.options.rootPath, adminRouter);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
