import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

router.post('/login', adminController.login);
router.get('/me', authenticateToken, adminController.getMe);
router.post('/logout', authenticateToken, adminController.logout);

export default router;
