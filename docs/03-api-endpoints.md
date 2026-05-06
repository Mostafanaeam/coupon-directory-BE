# API Endpoints

All endpoints are prefixed with `/api`.

## Public Endpoints (Unprotected)

### Categories
- `GET /categories` - List all categories with `couponCount`.

### Stores
- `GET /stores` - List all stores.
- `GET /stores/:slug` - Get store details by slug, including its active coupons.

### Coupons
- `GET /coupons` - List all active coupons (supports filtering by `storeId` or `categoryId`).
- `POST /coupons/:id/click` - Increment `totalClicks` for a specific coupon and its parent store.

---

## Admin Endpoints (Protected via JWT)

### Authentication
- `POST /admin/login` - Returns JWT token.
- `GET /admin/me` - Validate session and return user profile.

### Dashboard Analytics
- `GET /admin/analytics/summary` - Returns `totalStores`, `totalCoupons`, `activeCoupons`, `totalCategories`, `totalClicks`, and `estimatedRevenue`.
- `GET /admin/analytics/top-coupons` - Returns top 10 coupons by clicks.
- `GET /admin/analytics/top-stores` - Returns top 10 stores by clicks.

### Management (CRUD)
- **Categories:** `POST /admin/categories`, `PUT /admin/categories/:id`, `DELETE /admin/categories/:id`
- **Stores:** `POST /admin/stores`, `PUT /admin/stores/:id`, `DELETE /admin/stores/:id`
- **Coupons:** `POST /admin/coupons`, `PUT /admin/coupons/:id`, `DELETE /admin/coupons/:id`
