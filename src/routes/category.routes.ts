import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

// Public routes
router.get('/', categoryController.getAll);

// Admin routes
router.post('/', authenticateToken, categoryController.create);
router.put('/:id', authenticateToken, categoryController.update);
router.delete('/:id', authenticateToken, categoryController.remove);

export default router;
