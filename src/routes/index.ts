import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import categoryRoutes from './category.routes.js';
import storeRoutes from './store.routes.js';
import couponRoutes from './coupon.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/stores', storeRoutes);
router.use('/coupons', couponRoutes);
router.use('/admin/analytics', analyticsRoutes);

export default router;
