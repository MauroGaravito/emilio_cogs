import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import User from '../models/User.js';

const generateStrongPassword = (length = 20) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_=+';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    const idx = crypto.randomInt(0, alphabet.length);
    pwd += alphabet[idx];
  }
  return pwd;
};

export const ensureAdmin = async () => {
  // Create a default admin only if none exist
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount > 0) return null;

  const name = process.env.ADMIN_NAME || 'Admin User';
  const email = process.env.ADMIN_EMAIL || 'admin@emilios.com';
  const passwordPlain = generateStrongPassword(22);

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordPlain, salt);

  const admin = await User.create({ name, email, password, role: 'admin' });

  const banner = [
    '================ ADMIN INITIALIZED ================',
    `Email:    ${email}`,
    `Password: ${passwordPlain}`,
    'NOTE: Store these credentials securely and change the password after first login.',
    'Access the Admin panel at: /admin',
    '===================================================',
  ].join('\n');

  // Print to logs (visible in Dokploy logs)
  console.log(banner);

  // Optionally write to a file if a path is provided (e.g., a mounted volume)
  const outPath = process.env.ADMIN_CREDENTIALS_PATH;
  if (outPath) {
    try {
      if (!fs.existsSync(outPath)) {
        fs.writeFileSync(outPath, `email=${email}\npassword=${passwordPlain}\n`, { encoding: 'utf8', flag: 'wx' });
      }
    } catch (e) {
      console.warn('Could not persist admin credentials:', e.message);
    }
  }

  return { id: admin._id, email, password: passwordPlain };
};

