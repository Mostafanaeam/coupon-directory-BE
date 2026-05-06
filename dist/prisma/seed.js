import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    // Clear existing data
    await prisma.coupon.deleteMany();
    await prisma.store.deleteMany();
    await prisma.category.deleteMany();
    await prisma.admin.deleteMany();
    // Categories
    const electronics = await prisma.category.create({
        data: { nameAr: 'إلكترونيات', nameEn: 'Electronics', slug: 'electronics', icon: '💻' }
    });
    const fashion = await prisma.category.create({
        data: { nameAr: 'أزياء', nameEn: 'Fashion', slug: 'fashion', icon: '👗' }
    });
    // Stores
    const amazon = await prisma.store.create({
        data: {
            nameAr: 'أمازون', nameEn: 'Amazon', slug: 'amazon',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
            categoryId: electronics.id
        }
    });
    const noon = await prisma.store.create({
        data: {
            nameAr: 'نون', nameEn: 'Noon', slug: 'noon',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Noon_Logo.svg',
            categoryId: fashion.id
        }
    });
    // Coupons
    await prisma.coupon.create({
        data: {
            titleAr: 'خصم 20% على جميع المنتجات', titleEn: '20% Off All Products',
            code: 'SAVE20', discountType: 'percentage', discountValue: 20,
            storeId: amazon.id, isActive: true
        }
    });
    await prisma.coupon.create({
        data: {
            titleAr: 'شحن مجاني للطلبات فوق 100 ريال', titleEn: 'Free Shipping Over 100 SAR',
            code: 'FREE100', discountType: 'free_shipping',
            storeId: noon.id, isActive: true
        }
    });
    // Admin
    await prisma.admin.create({
        data: { username: 'admin', password: 'admin' }
    });
    console.log('Seed data created!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map