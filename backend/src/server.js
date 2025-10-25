import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import app from './app.js';
import User from './models/User.js';

dotenv.config();

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
