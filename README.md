# KLI Member Portal

> An institutional learning platform for Kelly Legacy Institute members

## Overview

Production domain: https://access.kellylegacyestates.com
Deployment status: Not yet deployed

The KLI Member Portal is a professional, secure platform for delivering the Fiduciary Foundations curriculum and curated research materials to institutional members. Built with modern web technologies and designed with the aesthetic of a university, research institute, or professional academy.

**Live**: https://access.kellylegacyestates.com

## Features

### Authentication & Access Control
- ✅ Secure email/password authentication via Supabase Auth
- ✅ Email verification and password reset
- ✅ Protected routes with role-based access
- ✅ Stripe subscription integration
- ✅ Role-based authorization (member, moderator, admin)

### Member Dashboard
- 📊 Personal dashboard with welcome screen
- 📈 Progress tracking across all courses
- 🔖 Resume interrupted lessons
- 📚 Access to relevant materials
- 📋 Weekly briefings and announcements
- 📰 Recent publications

### Curriculum
- 🎓 Fiduciary Foundations program (8 modules)
  - The Record
  - Parties and Capacity
  - Standing and Jurisdiction
  - Evidence and Burdens
  - Administrative Procedure
  - Fiduciary Duty
  - Reading Law and Policy
  - Building the Administrative Record

Each module includes:
- Comprehensive lesson pages
- Embedded video content
- Downloadable course materials
- Personal notes and annotations
- Progress tracking per lesson

### Research Library
- 🔍 Searchable publication database
- 📁 Organized by category:
  - Fiduciary Studies
  - Trust Administration
  - Jurisdiction
  - Administrative Procedure
  - Public Records
  - Governance
  - Banking
  - AI Governance
- 🔖 Member bookmarking and reading lists
- 📖 PDF and document support

### Publications & Content
- 📝 Curated publications and research materials
- 📬 Weekly briefings with curated content
- 📢 Member announcements and communications
- 🏛️ Institutional branding and aesthetics

### Member Account
- 👤 Profile management
- 💳 Subscription and billing management
- 🔐 Password and security settings
- 📧 Email preferences

### Admin Dashboard
- 👥 Member management and oversight
- 📚 Course and curriculum management
- ✏️ Lesson creation and editing
- 📖 Library and publication management
- 📝 Publications and research content management
- 📢 Announcement publishing
- 📧 Weekly briefing creation
- 📊 Analytics and engagement metrics

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS with custom design system |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | Supabase PostgreSQL with Row Level Security |
| **Authentication** | Supabase Auth (email/password, JWT) |
| **Payments** | Stripe (subscriptions, webhooks) |
| **Deployment** | Vercel (with auto-scaling) |
| **Package Manager** | pnpm |

## Design Language

The platform embodies institutional credibility and academic prestige:

- **Color Palette**:
  - Deep Navy (#001f3f) - Primary
  - Gold (#D4AF37) - Accents
  - Parchment (#F5F1DE) - Backgrounds
  - Dark Grey (#2C3E50) - Text

- **Typography**:
  - Headings: Serif fonts (Playfair Display)
  - Body: Clean sans-serif (Inter)

- **Experience**:
  - Clean, administrative layouts
  - Mobile-first responsive design
  - Professional, accessible components
  - Intuitive navigation

## Quick Start

### Development Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/DelonteKelly/KLI-MEMBER-PORTAL.git
   cd KLI-MEMBER-PORTAL
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase and Stripe credentials
   ```

4. **Set up database**
   ```bash
   supabase link --project-ref [your-project-ref]
   supabase db push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   Visit http://localhost:3000

### Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Unit tests
pnpm test

# Test coverage
pnpm test:coverage
```

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
kli-member-portal/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Public auth routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── (protected)/              # Protected member routes
│   │   ├── dashboard/
│   │   ├── curriculum/
│   │   ├── library/
│   │   ├── publications/
│   │   ├── account/
│   │   └── admin/                # Admin routes (role-gated)
│   ├── api/                      # API endpoints
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Public landing
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── layouts/                  # Layout components
│   ├── features/                 # Feature-specific components
│   └── common/                   # Shared components
├── lib/                          # Core business logic
│   ├── auth/                     # Authentication utilities
│   ├── db/                       # Database queries/mutations
│   ├── api/                      # API client functions
│   ├── stripe/                   # Stripe integration
│   └── utils/                    # Helper utilities
├── migrations/                   # Database migrations
├── public/                       # Static assets
├── styles/                       # Global styles
├── types/                        # TypeScript type definitions
├── __tests__/                    # Test files
├── .env.example                  # Environment template
├── package.json                  # Project metadata
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind configuration
├── next.config.js                # Next.js configuration
├── ARCHITECTURE.md               # Architecture documentation
├── DATABASE.md                   # Database schema & RLS policies
├── SETUP.md                      # Development setup guide
└── README.md                     # This file
```

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, data flow, and design patterns
- **[DATABASE.md](./DATABASE.md)** - Database schema, RLS policies, and migrations
- **[SETUP.md](./SETUP.md)** - Development environment setup and deployment
- **[README.md](./README.md)** - This file

## API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Member Resources
- `GET /api/members/profile` - Get current member profile
- `PUT /api/members/profile` - Update member profile
- `GET /api/members/progress` - Get learning progress
- `GET /api/members/dashboard` - Get dashboard data

### Courses & Lessons
- `GET /api/courses` - List available courses
- `GET /api/courses/[courseId]` - Get course details
- `GET /api/courses/[courseId]/lessons` - List lessons
- `GET /api/courses/[courseId]/lessons/[lessonId]` - Get lesson details
- `POST /api/progress/[lessonId]` - Update lesson progress

### Publications
- `GET /api/publications` - List publications
- `GET /api/publications/[publicationId]` - Get publication details
- `POST /api/publications/[publicationId]/bookmark` - Bookmark publication
- `DELETE /api/publications/[publicationId]/bookmark` - Remove bookmark

### Admin
- `GET /api/admin/members` - List all members
- `PUT /api/admin/members/[memberId]` - Update member
- `GET /api/admin/content` - Manage content
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/[courseId]` - Update course

### Payments
- `POST /api/payments/subscribe` - Start subscription
- `POST /api/payments/cancel-subscription` - Cancel subscription
- `POST /api/payments/webhook` - Stripe webhook handler

## Security

### Core Security Features
- ✅ JWT token-based authentication
- ✅ Row Level Security (RLS) on all database tables
- ✅ Protected API routes with authentication checks
- ✅ Role-based authorization with admin gates
- ✅ Stripe webhook signature verification
- ✅ HTTPS enforcement in production
- ✅ Secure password hashing
- ✅ CSRF protection via SameSite cookies
- ✅ Audit logging of sensitive operations
- ✅ Environment variable isolation

### Privacy
- Members can only access their own data
- Subscription status controls content access
- Admin access is role-restricted
- All member progress is private
- Audit trails for compliance

## Deployment

### Deploy to Vercel

```bash
# Push to main branch triggers automatic deployment
git push origin main
```

Environment variables are managed through Vercel project settings.

### Manual Deployment

```bash
# Build
pnpm build

# Test production build locally
pnpm start

# Deploy using Vercel CLI
vercel deploy --prod
```

### Database Backups

Supabase provides:
- Automatic daily backups (7-day retention)
- Point-in-time recovery
- Manual backup export

## Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests (Future Phase)

```bash
pnpm test:e2e
```

### Database Testing

See [DATABASE.md](./DATABASE.md) for RLS policy testing.

## Performance

- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: React Query (5-minute TTL), Vercel Edge Cache
- **Database**: Connection pooling, optimized queries
- **Static Generation**: Public pages pre-rendered at build time
- **CDN**: Vercel Edge Network for global distribution

## Monitoring

- **Vercel Analytics**: Real User Monitoring (RUM)
- **Error Tracking**: Integration point for Sentry (optional)
- **Database**: Supabase dashboard metrics
- **Logs**: Vercel logs + structured application logging

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code standards
3. Run tests and linting: `pnpm type-check && pnpm lint && pnpm test`
4. Commit with semantic messages: `git commit -m "feat: description"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

## Roadmap

### Phase 1 (Current)
- ✅ Project scaffolding and documentation
- [ ] Authentication system setup
- [ ] Database schema and migrations
- [ ] Member dashboard
- [ ] Course structure and basic lessons
- [ ] Admin dashboard foundation

### Phase 2
- Email notifications and digests
- Progress reminders
- Enhanced search
- Saved reading lists
- Enhanced admin capabilities

### Phase 3
- Video hosting and streaming
- Interactive assessments and quizzes
- Completion certificates
- Course completion badges

### Phase 4
- Member forums and discussions
- Peer collaboration features
- Live webinars/events integration
- Social features

### Phase 5
- Advanced analytics
- Member engagement metrics
- Cohort management
- Certificate issuing

### Phase 6
- Mobile application
- Offline mode
- Advanced search with filters
- AI-powered recommendations

## License

All rights reserved. This is a proprietary project for Kelly Legacy Institute.

## Support

For issues, feature requests, or questions:
1. Check existing [GitHub Issues](https://github.com/DelonteKelly/KLI-MEMBER-PORTAL/issues)
2. Create a detailed issue if needed
3. Reference relevant documentation

## Contact

**Kelly Legacy Institute**
- Website: https://www.kellylegacyestates.com
- Platform: https://access.kellylegacyestates.com
- Support: [support contact info to be added]

---

**Last Updated**: July 22, 2026
**Version**: 1.0.0-alpha
**Status**: In Active Development
