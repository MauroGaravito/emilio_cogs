import { Router } from 'express';
import { getSummary } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getSummary);

export default router;

