import { Router } from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import roleMiddleware from '../../middlewares/roleMiddleware.js';
import { register, login, me } from './authController.js';
import { successResponse } from '../../utils/apiResponse.js';

const router = Router();

router.get('/restaurant/health', (req, res) => {
  return successResponse(res, 200, 'Restaurant module is healthy', {
    module: 'restaurant',
    status: 'ok',
  });
});

router.post('/restaurant/auth/register', register);
router.post('/restaurant/auth/login', login);
router.get('/restaurant/auth/me', authMiddleware, me);
router.get(
  '/restaurant/auth/manager-test',
  authMiddleware,
  roleMiddleware(['RestaurantManager']),
  (req, res) => {
    return successResponse(res, 200, 'Manager access granted.', { user: req.user });
  }
);

export default router;
