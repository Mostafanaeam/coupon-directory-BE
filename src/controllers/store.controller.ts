import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import * as storeService from '../services/store.service.js';

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const stores = await storeService.getAllStores();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

export const getBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const store = await storeService.getStoreBySlug(slug as string);
    res.json(store);
  } catch (error: any) {
    const status = error.message === 'Store not found' ? 404 : 500;
    res.status(status).json({ error: error.message || 'Failed to fetch store' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const store = await storeService.createStore(req.body);
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create store' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const store = await storeService.updateStore(Number(id), req.body);
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update store' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await storeService.deleteStore(Number(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete store' });
  }
};
