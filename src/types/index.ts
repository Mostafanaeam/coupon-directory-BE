import type { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export interface CategoryInput {
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
}

export interface StoreInput {
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  logoUrl?: string;
  websiteUrl?: string;
  categoryId?: number;
}

export interface CouponInput {
  titleAr: string;
  titleEn: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue?: number;
  storeId: number;
  affiliateUrl?: string;
  commissionValue?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export interface AnalyticsSummary {
  totalStores: number;
  totalCoupons: number;
  activeCoupons: number;
  totalCategories: number;
  totalClicks: number;
  estimatedRevenue: number;
}
