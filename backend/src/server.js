import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';

import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emilios';

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log('MongoDB connected');
    // Bootstrap default admin if no users exist
    (async () => {
      try {
        const count = await User.countDocuments();
        if (count === 0) {
          const name = process.env.ADMIN_NAME || 'Admin User';
          const email = process.env.ADMIN_EMAIL || 'admin@emilios.com';
          const password = process.env.ADMIN_PASSWORD || 'change-me-now';
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password, salt);
          await User.create({ name, email, password: hashed, role: 'admin' });
          console.log(`Default admin created: ${email}`);
        }
      } catch (e) {
        console.error('Bootstrap admin error:', e.message);
      }
    })();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
