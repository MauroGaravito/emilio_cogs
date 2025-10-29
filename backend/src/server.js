import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import User from './models/User.js';
import { ensureAdmin } from './utils/bootstrapAdmin.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emilios';

mongoose
  .connect(MONGO_URI, { autoIndex: true })
  .then(async () => {
    console.log('MongoDB connected');
    try {
      await ensureAdmin();
    } catch (e) {
      console.error('Admin bootstrap error:', e.message);
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
