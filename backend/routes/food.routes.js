import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';
import {
  listFoods,
  getFood,
  createFoodHandler,
  updateFoodHandler,
  deleteFoodHandler,
} from '../controllers/food.controller.js';

const router = Router();

router.get('/', listFoods);
router.get('/:id', getFood);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['RestaurantManager']),
  uploadSingle,
  createFoodHandler
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['RestaurantManager']),
  uploadSingle,
  updateFoodHandler
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['RestaurantManager']),
  deleteFoodHandler
);

export default router;
