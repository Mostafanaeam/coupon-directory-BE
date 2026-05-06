import prisma from '../config/db.js';
import type { AnalyticsSummary } from '../types/index.js';

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const [totalStores, totalCoupons, activeCoupons, totalCategories, totalClicks, estimatedRevenue] = await Promise.all([
    prisma.store.count(),
    prisma.coupon.count(),
    prisma.coupon.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.coupon.aggregate({ _sum: { totalClicks: true } }),
    prisma.coupon.aggregate({ _sum: { commissionValue: true } })
  ]);
  
  return {
    totalStores,
    totalCoupons,
    activeCoupons,
    totalCategories,
    totalClicks: totalClicks._sum.totalClicks || 0,
    estimatedRevenue: estimatedRevenue._sum.commissionValue || 0
  };
};

export const getTopCoupons = async (limit: number = 10) => {
  const coupons = await prisma.coupon.findMany({
    take: limit,
    orderBy: { totalClicks: 'desc' },
    include: { store: true }
  });
  
  return coupons.map((c) => ({
    ...c,
    storeName: c.store.nameEn
  }));
};

export const getTopStores = async (limit: number = 10) => {
  return await prisma.store.findMany({
    take: limit,
    orderBy: { totalClicks: 'desc' }
  });
};
