import prisma from '../config/db.js';
import type { CategoryInput } from '../types/index.js';

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: { stores: true }
  });
  
  return categories.map((cat) => ({
    ...cat,
    storeCount: cat.stores.length
  }));
};

export const createCategory = async (data: CategoryInput) => {
  return await prisma.category.create({ data });
};

export const updateCategory = async (id: number, data: Partial<CategoryInput>) => {
  return await prisma.category.update({
    where: { id },
    data
  });
};

export const deleteCategory = async (id: number) => {
  await prisma.category.delete({ where: { id } });
  return { success: true };
};
