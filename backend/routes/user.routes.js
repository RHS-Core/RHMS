import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { getUsers, createUser, updateUserStatus } from '../controllers/user.controller.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['SuperAdmin', 'RestaurantManager', 'HotelManager']), getUsers);
router.post('/create', authMiddleware, roleMiddleware(['SuperAdmin', 'RestaurantManager', 'HotelManager']), createUser);
router.patch('/:id/status', authMiddleware, roleMiddleware(['SuperAdmin', 'RestaurantManager', 'HotelManager']), updateUserStatus);

export default router;
