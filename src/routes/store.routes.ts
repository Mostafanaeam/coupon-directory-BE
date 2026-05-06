import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as storeController from '../controllers/store.controller.js';

const router = Router();

// Public routes
router.get('/', storeController.getAll);
router.get('/:slug', storeController.getBySlug);

// Admin routes
router.post('/', authenticateToken, storeController.create);
router.put('/:id', authenticateToken, storeController.update);
router.delete('/:id', authenticateToken, storeController.remove);

export default router;
