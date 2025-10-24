import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.post('/login', login); // public
router.post('/register', authMiddleware, roleMiddleware('admin'), register);
router.get('/me', authMiddleware, getProfile);

export default router;

