import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import {
  createOrderHandler,
  listOrders,
  getOrderHandler,
  updateOrderStatusHandler,
  updateOrderItemsHandler,
} from '../controllers/order.controller.js';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['Customer', 'RestaurantStaff', 'RestaurantManager']), createOrderHandler);
router.get('/', authMiddleware, roleMiddleware(['RestaurantStaff', 'RestaurantManager']), listOrders);
router.get('/:id', authMiddleware, roleMiddleware(['Customer', 'RestaurantStaff', 'RestaurantManager']), getOrderHandler);
router.put('/:id/status', authMiddleware, roleMiddleware(['RestaurantStaff', 'RestaurantManager']), updateOrderStatusHandler);
router.put('/:id/items', authMiddleware, roleMiddleware(['Customer', 'RestaurantStaff', 'RestaurantManager']), updateOrderItemsHandler);

export default router;
