import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import * as adminService from '../services/admin.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new AppError('Username and password required', 400);
    }
    const result = await adminService.loginAdmin(username, password);
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) throw error;
    res.status(401).json({ error: (error as Error).message || 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const admin = await adminService.getAdminById(req.user!.id);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get admin info' });
  }
};

export const logout = (_req: AuthRequest, res: Response) => {
  res.json({ success: true });
};
