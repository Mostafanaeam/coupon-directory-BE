# Admin Dashboard Logic

## 1. Analytics Aggregation
The frontend expects a summary object. Calculate these in the backend using Prisma `aggregate` or `count`:

- **Total Stores:** `prisma.store.count()`
- **Total Coupons:** `prisma.coupon.count()`
- **Total Categories:** `prisma.category.count()`
- **Active Coupons:** `prisma.coupon.count({ where: { isActive: true } })`
- **Total Clicks:** `prisma.coupon.aggregate({ _sum: { totalClicks: true } })`
- **Estimated Revenue:** `prisma.coupon.findMany().then(coupons => coupons.reduce((sum, c) => sum + (c.totalClicks * (c.commissionValue || 0)), 0))` (Legacy logic uses `sum(totalClicks * commissionValue)`).

## 2. Top Performers
- **Top Stores (by total coupon clicks):**
  ```sql
  SELECT s.*, COALESCE(SUM(c.totalClicks), 0) as clicks 
  FROM Store s LEFT JOIN Coupon c ON s.id = c.storeId 
  GROUP BY s.id ORDER BY clicks DESC LIMIT 10
  ```
- **Top Coupons (by clicks):**
  ```sql
  SELECT c.*, s.nameEn as storeName 
  FROM Coupon c JOIN Store s ON c.storeId = s.id 
  ORDER BY c.totalClicks DESC LIMIT 10
  ```

## 3. Image Upload Handling
The frontend expects `logoUrl`. 
- **Recommendation:** Use Neon's integration with S3/Cloudinary or allow admins to paste an external URL.

## 4. Bilingual Search/Filter
When searching for stores or coupons, check both Arabic and English fields:
```javascript
where: {
  OR: [
    { nameAr: { contains: query, mode: 'insensitive' } },
    { nameEn: { contains: query, mode: 'insensitive' } }
  ]
}
```
