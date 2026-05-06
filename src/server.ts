import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_dev_key', (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'super_secret_dev_key',
      { expiresIn: '24h' }
    );
    res.json({ success: true, token, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current admin
app.get('/api/admin/me', authenticateToken, async (req: any, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, lastLogin: true }
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get admin info' });
  }
});

// Admin logout
app.post('/api/admin/logout', authenticateToken, (req, res) => {
  res.json({ success: true });
});

// Categories - Public
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { stores: true }
    });
    const result = categories.map(cat => ({
      ...cat,
      couponCount: cat.stores.reduce((acc, store) => acc + store.totalClicks, 0)
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Categories - Admin
app.post('/api/admin/categories', authenticateToken, async (req, res) => {
  try {
    const { nameAr, nameEn, slug, icon } = req.body;
    const category = await prisma.category.create({
      data: { nameAr, nameEn, slug, icon }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/admin/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nameAr, nameEn, slug, icon } = req.body;
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { nameAr, nameEn, slug, icon }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/admin/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Stores - Public
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: { category: true, coupons: true }
    });
    const result = stores.map(store => ({
      ...store,
      couponCount: store.coupons.length,
      categoryName: store.category?.nameEn
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

app.get('/api/stores/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const store = await prisma.store.findUnique({
      where: { slug },
      include: { category: true, coupons: true }
    });
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// Stores - Admin
app.post('/api/admin/stores', authenticateToken, async (req, res) => {
  try {
    const { nameAr, nameEn, slug, descriptionAr, descriptionEn, logoUrl, websiteUrl, categoryId } = req.body;
    const store = await prisma.store.create({
      data: { nameAr, nameEn, slug, descriptionAr, descriptionEn, logoUrl, websiteUrl, categoryId }
    });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create store' });
  }
});

app.put('/api/admin/stores/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nameAr, nameEn, slug, descriptionAr, descriptionEn, logoUrl, websiteUrl, categoryId } = req.body;
    const store = await prisma.store.update({
      where: { id: Number(id) },
      data: { nameAr, nameEn, slug, descriptionAr, descriptionEn, logoUrl, websiteUrl, categoryId }
    });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update store' });
  }
});

app.delete('/api/admin/stores/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.store.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete store' });
  }
});

// Coupons - Public
app.get('/api/coupons', async (req, res) => {
  try {
    const { storeId, isActive } = req.query;
    const where: any = {};
    if (storeId) where.storeId = Number(storeId);
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const coupons = await prisma.coupon.findMany({
      where,
      include: { store: true }
    });
    const result = coupons.map(c => ({
      ...c,
      storeName: c.store.nameEn,
      storeLogoUrl: c.store.logoUrl
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

app.post('/api/coupons/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.update({
      where: { id: Number(id) },
      data: { totalClicks: { increment: 1 } }
    });
    await prisma.store.update({
      where: { id: coupon.storeId },
      data: { totalClicks: { increment: 1 } }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record click' });
  }
});

// Coupons - Admin
app.post('/api/admin/coupons', authenticateToken, async (req, res) => {
  try {
    const { titleAr, titleEn, code, discountType, discountValue, storeId, affiliateUrl, commissionValue, expiresAt, isActive } = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        titleAr, titleEn, code, discountType, discountValue, storeId,
        affiliateUrl, commissionValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive
      }
    });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

app.put('/api/admin/coupons/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titleAr, titleEn, code, discountType, discountValue, storeId, affiliateUrl, commissionValue, expiresAt, isActive } = req.body;
    const coupon = await prisma.coupon.update({
      where: { id: Number(id) },
      data: {
        titleAr, titleEn, code, discountType, discountValue, storeId,
        affiliateUrl, commissionValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive
      }
    });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

app.delete('/api/admin/coupons/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// Analytics
app.get('/api/admin/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const [totalStores, totalCoupons, activeCoupons, totalCategories, totalClicks] = await Promise.all([
      prisma.store.count(),
      prisma.coupon.count(),
      prisma.coupon.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.coupon.aggregate({ _sum: { totalClicks: true } })
    ]);
    
    const estimatedRevenue = await prisma.coupon.aggregate({
      _sum: { commissionValue: true }
    });
    
    res.json({
      totalStores,
      totalCoupons,
      activeCoupons,
      totalCategories,
      totalClicks: totalClicks._sum.totalClicks || 0,
      estimatedRevenue: estimatedRevenue._sum.commissionValue || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/api/admin/analytics/top-coupons', authenticateToken, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const coupons = await prisma.coupon.findMany({
      take: limit,
      orderBy: { totalClicks: 'desc' },
      include: { store: true }
    });
    const result = coupons.map(c => ({
      ...c,
      storeName: c.store.nameEn
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top coupons' });
  }
});

app.get('/api/admin/analytics/top-stores', authenticateToken, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const stores = await prisma.store.findMany({
      take: limit,
      orderBy: { totalClicks: 'desc' }
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top stores' });
  }
});

app.listen(Number(port), () => {
  console.log(`Server is running on port ${port}`);
});
