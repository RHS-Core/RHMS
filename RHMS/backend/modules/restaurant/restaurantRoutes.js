import { Router } from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import roleMiddleware from '../../middlewares/roleMiddleware.js';
import { register, login, me } from './authController.js';

const router = Router();

router.get('/restaurant/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Restaurant module is healthy',
    data: {
      module: 'restaurant',
      status: 'ok',
    },
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
    res.status(200).json({
      success: true,
      message: 'Manager access granted.',
      data: { user: req.user },
    });
  }
);

export default router;
