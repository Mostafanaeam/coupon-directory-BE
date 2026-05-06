# Tech Stack & Database Configuration

## Backend Architecture
- **Runtime:** Node.js (v20+ recommended)
- **Framework:** Express.js with TypeScript
- **ORM:** Prisma (optimized for PostgreSQL)
- **Validation:** Zod (for request body and environment validation)
- **Auth:** JWT (JSON Web Tokens) with `httpOnly` cookies or Bearer tokens

## Database: Neon (Serverless PostgreSQL)
Neon is a serverless PostgreSQL that requires specific handling for connection pooling to prevent "too many connections" errors during high traffic or cold starts.

### 1. Connection Strings
In your `.env` file, you must define two strings:
- `DATABASE_URL`: The direct connection string for migrations (`?sslmode=require`).
- `DIRECT_URL`: Used for Prisma Migrations to bypass the pooler if necessary.

### 2. Connection Pooling (Prisma + Neon)
Since Neon is serverless, use the **Neon Connection Pooler** (PgBouncer) string provided in your Neon console.
- Append `?pgbouncer=true` to your connection string if using a standard pooler.
- **Recommended:** Use the `@neondatabase/serverless` driver if deploying to edge environments (Vercel/Cloudflare).

### 3. Environment Variables (.env.example)
```bash
PORT=5000
NODE_ENV=development

# Database
# Generate this in Neon Console (Project Settings > Connection Strings)
DATABASE_URL="postgresql://user:password@ep-cool-db-123456.region.aws.neon.tech/neondb?sslmode=require"

# Auth
JWT_SECRET="your_super_secret_key_change_me"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="argon2_or_bcrypt_hash"

# CORS
FRONTEND_URL="http://localhost:5173"
```
