import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import * as analyticsService from '../services/analytics.service.js';

export const getSummary = async (_req: AuthRequest, res: Response) => {
  try {
    const summary = await analyticsService.getAnalyticsSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getTopCoupons = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const coupons = await analyticsService.getTopCoupons(limit);
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top coupons' });
  }
};

export const getTopStores = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const stores = await analyticsService.getTopStores(limit);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top stores' });
  }
};
