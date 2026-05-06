import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as couponController from '../controllers/coupon.controller.js';

const router = Router();

// Public routes
router.get('/', couponController.getAll);
router.post('/:id/click', couponController.recordClick);

// Admin routes
router.post('/', authenticateToken, couponController.create);
router.put('/:id', authenticateToken, couponController.update);
router.delete('/:id', authenticateToken, couponController.remove);

export default router;
