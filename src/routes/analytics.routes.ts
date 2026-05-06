import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = Router();

router.get('/summary', authenticateToken, analyticsController.getSummary);
router.get('/top-coupons', authenticateToken, analyticsController.getTopCoupons);
router.get('/top-stores', authenticateToken, analyticsController.getTopStores);

export default router;
