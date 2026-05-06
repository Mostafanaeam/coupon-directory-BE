import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';
import * as categoryController from '../controllers/category.controller.js';
import * as storeController from '../controllers/store.controller.js';
import * as couponController from '../controllers/coupon.controller.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = Router();

// Public routes
router.get('/categories', categoryController.getAll);
router.get('/stores', storeController.getAll);
router.get('/stores/:slug', storeController.getBySlug);
router.get('/coupons', couponController.getAll);
router.post('/coupons/:id/click', couponController.recordClick);

// Admin routes
router.post('/admin/login', adminController.login);
router.get('/admin/me', authenticateToken, adminController.getMe);
router.post('/admin/logout', authenticateToken, adminController.logout);
router.post('/admin/categories', authenticateToken, categoryController.create);
router.put('/admin/categories/:id', authenticateToken, categoryController.update);
router.delete('/admin/categories/:id', authenticateToken, categoryController.remove);
router.post('/admin/stores', authenticateToken, storeController.create);
router.put('/admin/stores/:id', authenticateToken, storeController.update);
router.delete('/admin/stores/:id', authenticateToken, storeController.remove);
router.post('/admin/coupons', authenticateToken, couponController.create);
router.put('/admin/coupons/:id', authenticateToken, couponController.update);
router.delete('/admin/coupons/:id', authenticateToken, couponController.remove);
router.get('/admin/analytics/summary', authenticateToken, analyticsController.getSummary);
router.get('/admin/analytics/top-coupons', authenticateToken, analyticsController.getTopCoupons);
router.get('/admin/analytics/top-stores', authenticateToken, analyticsController.getTopStores);

export default router;
