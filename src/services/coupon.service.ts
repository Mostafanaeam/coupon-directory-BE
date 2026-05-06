import prisma from '../config/db.js';
import type { CouponInput } from '../types/index.js';

export const getCoupons = async (storeId?: number, isActive?: boolean) => {
  const where: { storeId?: number; isActive?: boolean } = {};
  if (storeId) where.storeId = storeId;
  if (isActive !== undefined) where.isActive = isActive;
  
  const coupons = await prisma.coupon.findMany({
    where,
    include: { store: true }
  });
  
  return coupons.map((c) => ({
    ...c,
    storeName: c.store.nameEn,
    storeLogoUrl: c.store.logoUrl
  }));
};

export const recordCouponClick = async (id: number) => {
  const coupon = await prisma.coupon.update({
    where: { id },
    data: { totalClicks: { increment: 1 } }
  });
  
  await prisma.store.update({
    where: { id: coupon.storeId },
    data: { totalClicks: { increment: 1 } }
  });
  
  return { success: true };
};

export const createCoupon = async (data: CouponInput) => {
  return await prisma.coupon.create({
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }
  });
};

export const updateCoupon = async (id: number, data: Partial<CouponInput>) => {
  const { expiresAt, ...rest } = data;
  return await prisma.coupon.update({
    where: { id },
    data: {
      ...rest,
      ...(expiresAt !== undefined && { expiresAt: new Date(expiresAt) }),
    }
  });
};

export const deleteCoupon = async (id: number) => {
  await prisma.coupon.delete({ where: { id } });
  return { success: true };
};
