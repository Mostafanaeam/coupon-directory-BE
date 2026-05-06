import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
// Use standard PrismaClient instantiation; ensure DATABASE_URL is set in environment.
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DSGMb6cVIX3g@ep-noisy-band-anhbc9ci-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
        }
    }
});
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
// --- Public Endpoints ---
// GET /categories - List all categories with couponCount
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { stores: true }
                }
            }
        });
        const result = await Promise.all(categories.map(async (cat) => {
            const couponCount = await prisma.coupon.count({
                where: { store: { categoryId: cat.id }, isActive: true }
            });
            return { ...cat, couponCount };
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
// GET /stores - List all stores
app.get('/api/stores', async (req, res) => {
    try {
        const { categoryId, search } = req.query;
        const where = {};
        if (categoryId)
            where.categoryId = Number(categoryId);
        if (search) {
            where.OR = [
                { nameAr: { contains: String(search), mode: 'insensitive' } },
                { nameEn: { contains: String(search), mode: 'insensitive' } }
            ];
        }
        const stores = await prisma.store.findMany({
            where,
            include: {
                _count: { select: { coupons: { where: { isActive: true } } } }
            }
        });
        res.json(stores.map(s => ({ ...s, couponCount: s._count.coupons })));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});
// GET /stores/:slug - Get store details by slug, including its active coupons
app.get('/api/stores/:slug', async (req, res) => {
    try {
        const store = await prisma.store.findUnique({
            where: { slug: req.params.slug },
            include: {
                coupons: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!store)
            return res.status(404).json({ error: 'Store not found' });
        res.json(store);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch store' });
    }
});
// GET /coupons - List all active coupons
app.get('/api/coupons', async (req, res) => {
    try {
        const { storeId, categoryId, search } = req.query;
        const where = { isActive: true };
        if (storeId)
            where.storeId = Number(storeId);
        if (categoryId)
            where.store = { categoryId: Number(categoryId) };
        if (search) {
            where.OR = [
                { titleAr: { contains: String(search), mode: 'insensitive' } },
                { titleEn: { contains: String(search), mode: 'insensitive' } },
                { code: { contains: String(search), mode: 'insensitive' } }
            ];
        }
        const coupons = await prisma.coupon.findMany({
            where,
            include: { store: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(coupons);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});
// POST /coupons/:id/click - Increment clicks
app.post('/api/coupons/:id/click', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const coupon = await prisma.coupon.update({
            where: { id },
            data: { totalClicks: { increment: 1 } },
            include: { store: true }
        });
        await prisma.store.update({
            where: { id: coupon.storeId },
            data: { totalClicks: { increment: 1 } }
        });
        res.json({ affiliateUrl: coupon.affiliateUrl, totalClicks: coupon.totalClicks });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to record click' });
    }
});
// --- Admin Endpoints ---
// POST /admin/login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        res.json({ success: true, username: 'admin' });
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
// GET /admin/analytics/summary
app.get('/api/admin/analytics/summary', async (req, res) => {
    try {
        const totalStores = await prisma.store.count();
        const totalCoupons = await prisma.coupon.count();
        const totalCategories = await prisma.category.count();
        const activeCoupons = await prisma.coupon.count({ where: { isActive: true } });
        const clickData = await prisma.coupon.aggregate({
            _sum: { totalClicks: true }
        });
        const coupons = await prisma.coupon.findMany({
            select: { totalClicks: true, commissionValue: true }
        });
        const estimatedRevenue = coupons.reduce((sum, c) => sum + (c.totalClicks * (c.commissionValue || 0)), 0);
        res.json({
            totalStores,
            totalCoupons,
            totalCategories,
            activeCoupons,
            totalClicks: clickData._sum.totalClicks || 0,
            estimatedRevenue
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
// GET /admin/analytics/top-coupons
app.get('/api/admin/analytics/top-coupons', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const coupons = await prisma.coupon.findMany({
            take: limit,
            orderBy: { totalClicks: 'desc' },
            include: { store: { select: { nameEn: true } } }
        });
        res.json(coupons.map((c) => ({
            id: c.id,
            titleAr: c.titleAr,
            titleEn: c.titleEn,
            code: c.code,
            totalClicks: c.totalClicks,
            commissionValue: c.commissionValue,
            storeName: c.store.nameEn
        })));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch top coupons' });
    }
});
// GET /admin/analytics/top-stores
app.get('/api/admin/analytics/top-stores', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const stores = await prisma.store.findMany({
            take: limit,
            orderBy: { totalClicks: 'desc' }
        });
        const result = await Promise.all(stores.map(async (s) => {
            const couponCount = await prisma.coupon.count({ where: { storeId: s.id } });
            return {
                id: s.id,
                nameAr: s.nameAr,
                nameEn: s.nameEn,
                logoUrl: s.logoUrl,
                totalClicks: s.totalClicks,
                couponCount
            };
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch top stores' });
    }
});
// Stores CRUD
app.post('/api/admin/stores', async (req, res) => {
    const store = await prisma.store.create({ data: req.body });
    res.json(store);
});
app.put('/api/admin/stores/:id', async (req, res) => {
    const store = await prisma.store.update({
        where: { id: Number(req.params.id) },
        data: req.body
    });
    res.json(store);
});
app.delete('/api/admin/stores/:id', async (req, res) => {
    await prisma.store.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
});
// Coupons CRUD
app.post('/api/admin/coupons', async (req, res) => {
    const coupon = await prisma.coupon.create({ data: req.body });
    res.json(coupon);
});
app.put('/api/admin/coupons/:id', async (req, res) => {
    const coupon = await prisma.coupon.update({
        where: { id: Number(req.params.id) },
        data: req.body
    });
    res.json(coupon);
});
app.delete('/api/admin/coupons/:id', async (req, res) => {
    await prisma.coupon.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map