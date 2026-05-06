# Database Schema

Designed for Prisma ORM. This schema supports bilingual content (AR/EN) and tracks performance metrics for stores and coupons.

## Models

### 1. Category
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| id | Int | @id, @default(autoincrement) | Primary Key |
| nameAr | String | | Arabic Name |
| nameEn | String | | English Name |
| slug | String | @unique | URL-friendly identifier |
| icon | String? | | Emoji or icon class |
| createdAt | DateTime | @default(now) | |
| updatedAt | DateTime | @updatedAt | |
| stores | Store[] | | Relation to Stores |

### 2. Store
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| id | Int | @id, @default(autoincrement) | Primary Key |
| nameAr | String | | Arabic Name |
| nameEn | String | | English Name |
| slug | String | @unique | |
| descriptionAr| String? | @db.Text | |
| descriptionEn| String? | @db.Text | |
| logoUrl | String? | | |
| websiteUrl | String? | | |
| categoryId | Int? | @relation | Foreign Key to Category |
| totalClicks | Int | @default(0) | Aggregate clicks |
| createdAt | DateTime | @default(now) | |
| updatedAt | DateTime | @updatedAt | |
| coupons | Coupon[] | | Relation to Coupons |

### 3. Coupon
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| id | Int | @id, @default(autoincrement) | Primary Key |
| titleAr | String | | |
| titleEn | String | | |
| code | String | | The coupon code (e.g., SAVE20) |
| discountType | Enum | percentage, fixed, free_shipping | |
| discountValue| Float? | | |
| storeId | Int | @relation | Foreign Key to Store |
| affiliateUrl | String? | | |
| commissionValue| Float? | | Track expected earnings |
| expiresAt | DateTime?| | |
| isActive | Boolean | @default(true) | |
| totalClicks | Int | @default(0) | Individual coupon clicks |
| createdAt | DateTime | @default(now) | |
| updatedAt | DateTime | @updatedAt | |

### 4. Admin
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| id | Int | @id, @default(autoincrement) | |
| username | String | @unique | |
| password | String | | Hashed password |
| createdAt | DateTime | @default(now) | |
| lastLogin | DateTime?| | |

