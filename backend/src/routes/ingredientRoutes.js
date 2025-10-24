import { Router } from 'express';
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../controllers/ingredientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getIngredients);
router.post('/', authMiddleware, roleMiddleware('admin'), createIngredient);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateIngredient);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteIngredient);

export default router;

