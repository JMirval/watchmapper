# Deployment Guide - PostgreSQL on Vercel

This guide explains how to deploy WatchMapper with PostgreSQL on Vercel.

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, or any other PostgreSQL provider)

## Step 1: Set up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" and select "Postgres"
4. Choose your plan and region
5. Note down the connection string

### Option B: External PostgreSQL Provider

You can use any PostgreSQL provider like:

- Supabase
- PlanetScale
- Railway
- Neon
- AWS RDS

## Step 2: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Required Variables

```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET_KEY=your-super-secret-session-key-here
```

### Optional Variables

```
NODE_ENV=production
```

## Step 3: Database Migration

After setting up the environment variables, you need to run the database migrations:

1. **Option A: Using Vercel CLI**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Pull environment variables
   vercel env pull .env.local

   # Run migrations
   pnpm db:migrate
   ```

2. **Option B: Using Vercel Dashboard**
   - Go to your project's "Functions" tab
   - Create a new function to run migrations
   - Or use the Vercel Postgres dashboard to run SQL directly

## Step 4: Deploy

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js framework
4. The build process will include Prisma generation

## Step 5: Verify Deployment

1. Check that your app is running
2. Verify database connectivity
3. Test user registration and login
4. Check that all features work correctly

## Environment Variables Reference

### DATABASE_URL

The PostgreSQL connection string. Format:

```
postgresql://username:password@host:port/database
```

### SESSION_SECRET_KEY

A secure random string for session encryption. Generate one with:

```bash
openssl rand -base64 32
```

### NODE_ENV

Set to `production` for production deployments.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify your DATABASE_URL is correct
   - Check that your database is accessible from Vercel's servers
   - Ensure your database allows external connections

2. **Migration Errors**

   - Run `pnpm db:generate` to regenerate Prisma client
   - Check that your schema is compatible with PostgreSQL
   - Verify you have the correct permissions on your database

3. **Build Errors**
   - Ensure all environment variables are set
   - Check that Prisma can generate the client during build
   - Verify your package.json scripts are correct

### Useful Commands

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema changes (development only)
pnpm db:push

# Open Prisma Studio
pnpm db:studio

# Reset database (development only)
pnpm db:reset
```

## Local Development

For local development, you can use SQLite:

1. Create a `.env.local` file:

   ```
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET_KEY="your-dev-secret-key"
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

## Production Checklist

- [ ] PostgreSQL database is set up and accessible
- [ ] Environment variables are configured in Vercel
- [ ] Database migrations have been run
- [ ] Application is deployed and accessible
- [ ] All features are working correctly
- [ ] Error monitoring is set up (optional)
- [ ] Performance monitoring is configured (optional)
