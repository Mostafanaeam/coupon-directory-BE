import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import * as categoryService from '../services/category.service.js';

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(Number(id), req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(Number(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
