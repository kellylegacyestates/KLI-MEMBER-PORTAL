# KLI Member Portal - Development Setup Guide

## Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher (`npm install -g pnpm`)
- **Git**: Latest version
- **Supabase Account**: Free tier or higher
- **Stripe Account**: For payment testing
- **PostgreSQL Client** (optional): For direct database access

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/DelonteKelly/KLI-MEMBER-PORTAL.git
cd KLI-MEMBER-PORTAL
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-publishable-key]
STRIPE_SECRET_KEY=[your-secret-key]
STRIPE_WEBHOOK_SECRET=[your-webhook-secret]

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Email (optional - for future phases)
SENDGRID_API_KEY=
```

For production/staging, create `.env.production.local` or `.env.staging.local`.

### 4. Supabase Project Setup

#### 4a. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create new project in your organization
3. Copy the project URL and anon key to `.env.local`

#### 4b. Get Service Role Key

1. In Supabase dashboard, go to **Settings → API**
2. Copy the `service_role` key (keep this secret!)
3. Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

#### 4c. Configure Authentication

1. In Supabase dashboard, go to **Authentication → Providers**
2. Enable Email/Password provider:
   - Disable email confirmation (for dev)
   - Allow unverified logins
3. In **Auth → URL Configuration**:
   - Add Site URL: `http://localhost:3000`
   - Add Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/api/auth/callback/supabase`

#### 4d. Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project (use access token from Supabase dashboard)
supabase link --project-ref [your-project-ref]

# Apply migrations
supabase db push

# Or manually: Connect to Supabase and run SQL files in migrations/
```

### 5. Stripe Setup

#### 5a. Get Test Keys

1. Go to [stripe.com/dashboard](https://stripe.com/dashboard)
2. Enable test mode (toggle in top right)
3. Go to **Developers → API Keys**
4. Copy test keys to `.env.local`:
   - Publishable Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret Key: `STRIPE_SECRET_KEY`

#### 5b. Create Webhook Endpoint

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Linux: curl https://files.stripe.com/stripe-cli/install.sh -O && bash install.sh
# Windows: choco install stripe

# Authenticate Stripe CLI
stripe login

# Create webhook to forward events to local server
stripe listen --forward-to localhost:3000/api/payments/webhook

# Copy the webhook signing secret to .env.local
# STRIPE_WEBHOOK_SECRET=whsec_...
```

Keep this terminal open during development.

#### 5c. Test Webhook

```bash
stripe trigger payment_intent.succeeded
```

### 6. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## Database Migrations

### Creating New Migrations

```bash
# Create a new migration
supabase migration new [migration_name]

# This creates: migrations/[timestamp]_[migration_name].sql

# Edit the SQL file, then apply:
supabase db push
```

### Example Migration Structure

```sql
-- migrations/20240722_create_members_table.sql

-- Create table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_members_auth_id ON members(auth_id);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Members can view own profile" ON members
  FOR SELECT USING (auth.uid() = auth_id);
```

### Viewing Migration History

```bash
# List applied migrations
supabase migration list

# View migration status
supabase db pull
```

### Reverting Migrations

```bash
# Reset database to previous state
supabase db reset

# This runs all migrations fresh from the latest state
```

---

## Local Development Database

### Option 1: Use Supabase Staging Project (Recommended)

Use a separate "staging" Supabase project for development. This keeps production data safe.

```bash
# In .env.development.local
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
```

### Option 2: Use Supabase Local Stack

```bash
# Install Docker (prerequisite)

# Start local Supabase stack
supabase start

# Connect to local Postgres
supabase start
# Then: postgresql://postgres:postgres@localhost:54322/postgres

# Stop when done
supabase stop
```

---

## Testing & Validation

### Run Type Checking

```bash
pnpm type-check
```

### Run Linting

```bash
pnpm lint
```

### Run Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Database Tests

```bash
# Test RLS policies
psql postgresql://postgres:[password]@localhost:54322/postgres

-- Test query as authenticated user:
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "user-uuid"}';
SELECT * FROM members;
```

---

## Deployment

### Deploy to Vercel

#### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Create new project
3. Import from GitHub: `DelonteKelly/KLI-MEMBER-PORTAL`
4. Select Next.js framework

#### 2. Configure Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=[production-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[production-service-role]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[production-key]
STRIPE_SECRET_KEY=[production-secret]
STRIPE_WEBHOOK_SECRET=[production-webhook-secret]
NEXT_PUBLIC_APP_URL=https://access.kellylegacyestates.com
```

#### 3. Deploy

```bash
# Deploy (automatic on push to main)
git push origin main
```

Vercel will automatically:
- Build the Next.js app
- Run tests
- Deploy to production
- Configure SSL/HTTPS

#### 4. Configure Supabase for Production

In Supabase project settings:
1. Add production domain to Auth URL configuration
2. Update CORS settings if needed
3. Enable database backups

#### 5. Configure Stripe Webhooks for Production

In Stripe dashboard → Developers → Webhooks:
1. Add endpoint: `https://access.kellylegacyestates.com/api/payments/webhook`
2. Select events:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Copy webhook secret to Vercel environment

---

## Troubleshooting

### Supabase Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# If using Supabase CLI:
supabase db list
supabase db pull --dry-run
```

### Authentication Not Working

1. Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
2. Verify Auth URL configuration in Supabase dashboard includes your domain
3. Check browser cookies are enabled
4. Clear browser cache: DevTools → Application → Storage → Clear site data

### Stripe Webhook Not Receiving Events

1. Ensure `stripe listen` command is running
2. Verify webhook secret in `.env.local` matches the `whsec_` value from `stripe listen`
3. Check Stripe logs in dashboard → Developers → Webhooks → Event log
4. Test with: `stripe trigger payment_intent.succeeded`

### Database Migrations Failing

```bash
# Check migration status
supabase migration list

# Manually apply a specific migration
supabase db push --dry-run  # See what would be applied

# Reset to known good state
supabase db reset

# Then reapply migrations
supabase db push
```

### Port 3000 Already in Use

```bash
# Use different port
pnpm dev --port 3001

# Or kill process using port 3000
lsof -i :3000
kill -9 [PID]
```

---

## Development Workflows

### Adding a New Feature

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Run type check: `pnpm type-check`
4. Run linter: `pnpm lint`
5. Run tests: `pnpm test`
6. Commit: `git commit -m "feat: description"`
7. Push: `git push origin feature/your-feature`
8. Create Pull Request on GitHub

### Syncing with Production Database Schema

```bash
# Pull latest schema changes from production
supabase db pull

# Apply to local
supabase db reset
```

### Exporting Database for Analysis

```bash
# Export as SQL
pg_dump $DATABASE_URL > backup.sql

# Export as CSV (for specific table)
psql $DATABASE_URL \
  -c "COPY table_name TO STDOUT WITH CSV HEADER" > table.csv
```

---

## Performance Optimization

### Monitor Database Performance

In Supabase dashboard → Database → Network & Usage:
- View real-time connection count
- Monitor query duration
- Check cache hit ratio

### Enable Query Analysis

```bash
# In Supabase SQL editor:
EXPLAIN ANALYZE SELECT * FROM members WHERE email = 'user@example.com';
```

### Connection Pool Settings

In Supabase → Project Settings → Database:
- Pool size: 15 (for development), 25+ for production
- Connection timeout: 30 seconds

---

## Security Checklist

- [ ] All environment secrets are in `.env.local` (never committed)
- [ ] Supabase auth enabled with strong email verification
- [ ] Row Level Security (RLS) policies enabled on all tables
- [ ] Service role key is only used in server-side code
- [ ] Anon key is only used in client-side code
- [ ] Stripe webhook signature validation enabled
- [ ] HTTPS enforced in production
- [ ] Database backups enabled
- [ ] Audit logging implemented

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review documentation files
3. Check GitHub Issues
4. Create a new issue with detailed description

