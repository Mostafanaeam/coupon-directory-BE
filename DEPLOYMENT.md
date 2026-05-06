# Deployment to Vercel

## Prerequisites
- Vercel account
- PostgreSQL database (Neon, Supabase, or similar)

## Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings

### 3. Environment Variables
Add these in Vercel project settings → Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

### 4. Deploy
Click "Deploy" - Vercel will automatically detect the configuration.

## Important Notes

- The Express server runs as serverless functions on Vercel
- Database must be accessible from Vercel's servers (use Neon, Supabase, etc.)
- `prisma generate` runs automatically during build
- API endpoints will be at: `https://your-project.vercel.app/api/...`

## Database Setup
If using Neon (recommended):
1. Create a Neon project
2. Copy the connection string to `DATABASE_URL`
3. Run `npx prisma db push` locally first to set up schema
