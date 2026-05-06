import { type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../types/index.js';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_dev_key', (err, user) => {
    if (err || !user) return res.status(403).json({ error: 'Invalid token' });
    req.user = user as AuthRequest['user'];
    next();
  });
};
