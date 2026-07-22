# KLI Member Portal - Database Schema & RLS Policies

## Overview

The database uses PostgreSQL via Supabase with comprehensive Row Level Security (RLS) policies. All user data is organized by tenant (member organization) and role-based access.

## Database Schema

### Core Tables

#### 1. `auth.users` (Managed by Supabase)
```sql
- id: uuid (PK)
- email: text (unique)
- created_at: timestamp
- updated_at: timestamp
- last_sign_in_at: timestamp
```
**Note**: Supabase Auth manages this table. We extend it with the `members` table.

---

#### 2. `public.members`
User member profiles and subscription status.

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' 
    CHECK (role IN ('member', 'admin', 'moderator')),
  
  -- Subscription status
  subscription_status TEXT NOT NULL DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'canceled', 'past_due')),
  subscription_tier TEXT NOT NULL DEFAULT 'standard'
    CHECK (subscription_tier IN ('free', 'standard', 'premium')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  
  -- Profile
  bio TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  
  -- Tracking
  last_login_at TIMESTAMP,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_subscription_dates CHECK (
    subscription_end_date IS NULL OR subscription_start_date <= subscription_end_date
  )
);

CREATE INDEX idx_members_auth_id ON members(auth_id);
CREATE INDEX idx_members_stripe_customer_id ON members(stripe_customer_id);
CREATE INDEX idx_members_role ON members(role);
CREATE INDEX idx_members_subscription_status ON members(subscription_status);
```

---

#### 3. `public.courses`
Curriculum structure - the Fiduciary Foundations program.

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  module_number INTEGER NOT NULL UNIQUE,
  
  -- Content
  overview_content TEXT,
  learning_objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Access control
  required_tier TEXT NOT NULL DEFAULT 'standard'
    CHECK (required_tier IN ('free', 'standard', 'premium')),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Metadata
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  difficulty_level TEXT DEFAULT 'intermediate'
    CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_published ON courses(published);
CREATE INDEX idx_courses_order ON courses(order_index);
CREATE INDEX idx_courses_required_tier ON courses(required_tier);
```

---

#### 4. `public.lessons`
Individual lessons within courses.

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Content
  content TEXT,
  video_url TEXT,
  video_duration_seconds INTEGER,
  
  -- Materials
  downloadable_materials JSONB DEFAULT '{}'::JSONB,
  -- Example: [{"name": "Lesson Guide", "url": "...", "type": "pdf"}, ...]
  
  -- Metadata
  lesson_number INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(course_id, slug)
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_published ON lessons(published);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
```

---

#### 5. `public.member_progress`
Track member progress through lessons and courses.

```sql
CREATE TABLE member_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Progress tracking
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  progress_percentage INTEGER NOT NULL DEFAULT 0
    CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(member_id, lesson_id)
);

CREATE INDEX idx_member_progress_member_id ON member_progress(member_id);
CREATE INDEX idx_member_progress_lesson_id ON member_progress(lesson_id);
CREATE INDEX idx_member_progress_completed ON member_progress(member_id) 
  WHERE completed_at IS NOT NULL;
```

---

#### 6. `public.publications`
Research library and publications.

```sql
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  
  -- Metadata
  authors TEXT[] DEFAULT ARRAY[]::TEXT[],
  publication_date DATE,
  updated_date DATE,
  
  -- Categorization
  category TEXT NOT NULL
    CHECK (category IN (
      'Fiduciary Studies', 'Trust Administration', 'Jurisdiction', 
      'Administrative Procedure', 'Public Records', 'Governance', 
      'Banking', 'AI Governance'
    )),
  
  -- Access
  published BOOLEAN NOT NULL DEFAULT FALSE,
  required_tier TEXT NOT NULL DEFAULT 'standard',
  
  -- Content
  file_url TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'doc', 'txt', 'epub')),
  
  -- Tracking
  view_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_publications_category ON publications(category);
CREATE INDEX idx_publications_published ON publications(published);
CREATE INDEX idx_publications_required_tier ON publications(required_tier);
```

---

#### 7. `public.publications_members`
Many-to-many relationship for member reading lists.

```sql
CREATE TABLE publications_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  
  -- Tracking
  bookmarked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  read_at TIMESTAMP,
  notes TEXT,
  
  UNIQUE(member_id, publication_id)
);

CREATE INDEX idx_publications_members_member ON publications_members(member_id);
CREATE INDEX idx_publications_members_publication ON publications_members(publication_id);
```

---

#### 8. `public.announcements`
Member announcements and notifications.

```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Publication
  published_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_by UUID NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  
  -- Targeting
  tier_required TEXT NOT NULL DEFAULT 'free'
    CHECK (tier_required IN ('free', 'standard', 'premium')),
  
  -- Metadata
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_published_at ON announcements(published_at);
CREATE INDEX idx_announcements_featured ON announcements(featured);
```

---

#### 9. `public.weekly_briefings`
Weekly curated briefings for members.

```sql
CREATE TABLE weekly_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  
  -- Publication
  published_at TIMESTAMP NOT NULL DEFAULT NOW(),
  week_of DATE NOT NULL UNIQUE,
  published_by UUID NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  
  -- Targeting
  tier_required TEXT NOT NULL DEFAULT 'standard'
    CHECK (tier_required IN ('free', 'standard', 'premium')),
  
  -- Content references
  featured_publications UUID[],
  featured_lessons UUID[],
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weekly_briefings_week_of ON weekly_briefings(week_of);
CREATE INDEX idx_weekly_briefings_published_at ON weekly_briefings(published_at);
```

---

#### 10. `public.audit_logs`
Security and compliance audit trail.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User action
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  -- Details
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_member_id ON audit_logs(member_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

#### 11. `public.member_session_tokens`
For tracking active sessions and logout.

```sql
CREATE TABLE member_session_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  revoked_at TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_member_session_tokens_member ON member_session_tokens(member_id);
CREATE INDEX idx_member_session_tokens_expires ON member_session_tokens(expires_at) 
  WHERE revoked_at IS NULL;
```

---

## Row Level Security (RLS) Policies

### Policy: Members can only view/edit their own profile

```sql
-- Enable RLS on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Members can select their own data
CREATE POLICY "Members can select own profile" ON members
  FOR SELECT USING (
    auth.uid() = auth_id OR 
    EXISTS (
      SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Members can update their own profile
CREATE POLICY "Members can update own profile" ON members
  FOR UPDATE USING (
    auth.uid() = auth_id
  ) WITH CHECK (
    auth.uid() = auth_id AND
    -- Prevent members from changing their role
    role = (SELECT role FROM members WHERE auth_id = auth.uid())
  );

-- Admins can update any member
CREATE POLICY "Admins can update any member" ON members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );
```

### Policy: Member progress is private

```sql
ALTER TABLE member_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own progress" ON member_progress
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM members WHERE auth_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Members can update own progress" ON member_progress
  FOR UPDATE USING (
    member_id IN (
      SELECT id FROM members WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert own progress" ON member_progress
  FOR INSERT WITH CHECK (
    member_id IN (
      SELECT id FROM members WHERE auth_id = auth.uid()
    )
  );
```

### Policy: Publications are public for authorized tiers

```sql
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view published content by tier" ON publications
  FOR SELECT USING (
    published = TRUE AND
    required_tier IN (
      SELECT subscription_tier FROM members WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all publications" ON publications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can create publications" ON publications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update publications" ON publications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );
```

### Policy: Courses gated by subscription tier

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view courses by subscription tier" ON courses
  FOR SELECT USING (
    published = TRUE AND
    required_tier IN (
      SELECT subscription_tier FROM members WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all courses" ON courses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );
```

### Policy: Lessons follow course access

```sql
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view lessons for accessible courses" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_id
      AND c.published = TRUE
      AND c.required_tier IN (
        SELECT subscription_tier FROM members WHERE auth_id = auth.uid()
      )
    ) OR
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );
```

### Policy: Announcements by tier

```sql
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view announcements for their tier" ON announcements
  FOR SELECT USING (
    tier_required IN (
      SELECT subscription_tier FROM members WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can create announcements" ON announcements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );
```

### Policy: Audit logs are admin-only

```sql
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM members WHERE auth_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Audit logs are insert-only" ON audit_logs
  FOR INSERT WITH CHECK (TRUE);
```

---

## Migrations

Migrations are managed in `migrations/` directory using SQL files. Each migration is numbered and timestamped.

See [SETUP.md](./SETUP.md) for migration execution instructions.

---

## Data Backup & Recovery

- **Automated Backups**: Supabase provides daily backups (7-day retention)
- **Manual Backups**: Use `pg_dump` for full database exports
- **Point-in-time Recovery**: Available through Supabase dashboard

---

## Performance Optimization

### Indexes Created
- Member auth_id lookup
- Stripe customer/subscription lookup
- Course and lesson publication status
- Progress tracking by member
- Audit log searches by timestamp and member

### Query Optimization Guidelines
1. Always use parameterized queries (prevent SQL injection)
2. Use indexes for WHERE, JOIN, and ORDER BY clauses
3. Batch inserts for bulk operations
4. Connection pooling via Supabase

---

## Testing the Database

```bash
# Connect to development database
psql postgresql://[user]:[password]@[host]/[database]

# List all tables
\dt

# View RLS policies
SELECT tablename, policyname, qual, with_check 
FROM pg_policies 
ORDER BY tablename;

# Test RLS policy (as a user)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "user-uuid"}';
SELECT * FROM members;
```

---

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Syntax](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [DATABASE.md](./DATABASE.md) - This document
- [SETUP.md](./SETUP.md) - Database setup instructions
