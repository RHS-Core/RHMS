import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import {
  listTables,
  getTableHandler,
  createTableHandler,
  updateTableStatusHandler,
  deleteTableHandler,
  reserveTableHandler,
} from '../controllers/table.controller.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['Customer', 'RestaurantStaff', 'RestaurantManager']), listTables);
router.get('/:id', authMiddleware, roleMiddleware(['RestaurantStaff', 'RestaurantManager']), getTableHandler);
router.post('/', authMiddleware, roleMiddleware(['RestaurantManager']), createTableHandler);
router.put('/:id', authMiddleware, roleMiddleware(['RestaurantStaff', 'RestaurantManager']), updateTableStatusHandler);
router.delete('/:id', authMiddleware, roleMiddleware(['RestaurantManager']), deleteTableHandler);
router.post('/:id/reserve', authMiddleware, roleMiddleware(['Customer', 'RestaurantStaff', 'RestaurantManager']), reserveTableHandler);

export default router;
