import { Router } from 'express';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getRecipes);
router.get('/:id', authMiddleware, getRecipe);
router.post('/', authMiddleware, roleMiddleware('admin'), createRecipe);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateRecipe);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteRecipe);

export default router;

