import prisma from '../config/db.js';
import type { StoreInput } from '../types/index.js';

export const getAllStores = async () => {
  const stores = await prisma.store.findMany({
    include: { category: true, coupons: true }
  });
  
  return stores.map(store => ({
    ...store,
    couponCount: store.coupons.length,
    categoryName: store.category?.nameEn
  }));
};

export const getStoreBySlug = async (slug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug },
    include: { category: true, coupons: true }
  });
  
  if (!store) throw new Error('Store not found');
  return store;
};

export const createStore = async (data: StoreInput) => {
  return await prisma.store.create({ data });
};

export const updateStore = async (id: number, data: Partial<StoreInput>) => {
  return await prisma.store.update({
    where: { id },
    data
  });
};

export const deleteStore = async (id: number) => {
  await prisma.store.delete({ where: { id } });
  return { success: true };
};
