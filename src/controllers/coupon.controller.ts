import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import * as couponService from '../services/coupon.service.js';

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const { storeId, isActive } = _req.query;
    const coupons = await couponService.getCoupons(
      storeId ? Number(storeId) : undefined,
      isActive !== undefined ? isActive === 'true' : undefined
    );
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

export const recordClick = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await couponService.recordCouponClick(Number(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record click' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await couponService.updateCoupon(Number(id), req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await couponService.deleteCoupon(Number(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};
