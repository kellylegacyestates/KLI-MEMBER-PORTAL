# KLI Member Portal - Architecture

## Overview

The KLI Member Portal is an institutional learning platform built on Next.js 15 with a modern, professional design language. The architecture emphasizes security, scalability, and institutional credibility.

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS with custom institutional design system
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (JWT-based, email/password)
- **Payments**: Stripe (subscriptions, webhooks)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Architecture Layers

### 1. Presentation Layer (Client)

```
app/
├── (auth)/           # Authentication routes (unprotected)
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── verify-email/
├── (protected)/      # Member routes (protected)
│   ├── dashboard/
│   ├── curriculum/
│   ├── library/
│   ├── publications/
│   ├── account/
│   └── admin/        # Admin routes (role-gated)
├── layout.tsx        # Root layout with providers
├── page.tsx          # Public landing
└── error.tsx         # Error boundary
```

### 2. Business Logic Layer

```
lib/
├── auth/             # Authentication utilities
│   ├── client.ts     # Supabase client
│   ├── server.ts     # Server-side auth helpers
│   └── middleware.ts # Auth middleware
├── db/               # Database access
│   ├── queries/      # Prepared queries
│   ├── mutations/    # Write operations
│   └── schema.ts     # Type definitions
├── api/              # API client functions
│   ├── members.ts
│   ├── courses.ts
│   ├── publications.ts
│   └── payments.ts
├── stripe/           # Stripe integration
│   ├── client.ts
│   ├── webhooks.ts
│   └── validation.ts
└── utils/            # Shared utilities
    ├── validation.ts
    ├── formatting.ts
    └── constants.ts
```

### 3. API Layer

```
app/api/
├── auth/             # Authentication endpoints
│   ├── login/
│   ├── logout/
│   ├── refresh/
│   └── verify-email/
├── members/          # Member operations
│   ├── profile/
│   ├── progress/
│   └── [memberId]/
├── courses/          # Course operations
│   ├── [courseId]/lessons/
│   ├── [courseId]/progress/
│   └── [courseId]/materials/
├── publications/     # Publication endpoints
├── payments/         # Payment operations
│   ├── subscribe/
│   ├── cancel/
│   └── webhook/
└── admin/            # Admin operations
    ├── members/
    ├── courses/
    └── content/
```

### 4. Database Layer

PostgreSQL with Supabase:
- User management (via Supabase Auth)
- Member profiles and subscription status
- Course structure and lesson content
- Member progress tracking
- Publications and research materials
- Announcements and briefings
- Audit logs
- Row Level Security (RLS) policies

### 5. Integration Layer

- **Supabase Auth**: JWT token management, email verification
- **Stripe**: Subscription management, webhook processing
- **SendGrid/Resend**: Email delivery (optional)
- **Vercel**: Deployment and serverless compute

## Security Architecture

### Authentication Flow

```
User Input → NextAuth Validation → Supabase Auth → JWT Token → RLS Policies
```

### Authorization Strategy

1. **Token-based**: JWT tokens with role claims
2. **Database-level**: Row Level Security (RLS) on all tables
3. **Route-level**: Middleware checks for protected routes
4. **API-level**: Server-side validation on every API endpoint
5. **Webhook-level**: Stripe webhook signature verification

### Data Protection

- All API routes validate authentication before processing
- Database queries use parameterized statements
- RLS policies enforce tenant isolation
- Sensitive data is encrypted at rest (passwords, payment info)
- HTTPS only (enforced by Vercel)
- CSRF protection via SameSite cookies

## Component Architecture

### Design System

```
components/
├── ui/               # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── ...
├── layouts/          # Page layouts
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   └── AdminLayout.tsx
├── features/         # Feature components
│   ├── auth/
│   ├── curriculum/
│   ├── library/
│   └── admin/
└── common/           # Shared components
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

### Visual Identity

- **Color Palette**:
  - Primary: Deep Navy (#001f3f)
  - Accent: Gold (#D4AF37)
  - Neutral: Parchment (#F5F1DE)
  - Text: Dark Grey (#2C3E50)

- **Typography**:
  - Headings: Serif fonts (Playfair Display)
  - Body: Sans-serif (Inter)

- **Spacing & Grids**: 8px base unit, 12-column grid

## Data Flow

### Member Journey

1. **Registration**: User → Auth API → Supabase Auth → User table
2. **Subscription**: User → Stripe → Payment API → Stripe webhook → Member status update
3. **Learning**: Member → Dashboard → Course API → Progress tracking
4. **Content Access**: Member → Curriculum API → Lesson data (gated by subscription)

### Admin Operations

1. **Content Management**: Admin → Admin API → Database mutations → RLS validation
2. **Member Management**: Admin → Member API → User table queries
3. **Reports**: Admin → Dashboard → Analytics queries (aggregated, RLS-compliant)

## Caching Strategy

- **Client-side**: React Query for API response caching (5-minute TTL)
- **Database**: Supabase connection pooling
- **Static**: Next.js static generation for public pages
- **API Response**: HTTP caching headers on GET endpoints

## Error Handling

- **Client**: Error boundaries, user-friendly messages
- **API**: Standardized error responses with error codes
- **Database**: Transaction rollback on failures, audit logging
- **Stripe**: Webhook retry logic, idempotent operations

## Monitoring & Logging

- **Application Logs**: Vercel logs + custom structured logging
- **Error Tracking**: Optional (Sentry integration point)
- **Audit Logs**: Database table for all sensitive operations
- **Performance**: Vercel Analytics

## Deployment Architecture

```
Git Push → GitHub → Vercel Build → Test → Deploy to Production
                                     ↓
                         Supabase (auto-migrated)
                         Stripe (webhook configured)
                         Environment variables (Vercel secrets)
```

## Scalability Considerations

1. **Database**: Supabase auto-scaling, connection pooling
2. **API**: Serverless functions auto-scale on Vercel
3. **Static Content**: CDN delivery via Vercel Edge Network
4. **File Storage**: Supabase Storage for course materials
5. **Real-time**: Supabase Realtime for live updates (future phase)

## Testing Strategy

- **Unit Tests**: Jest (utilities, helpers)
- **Component Tests**: React Testing Library (UI components)
- **Integration Tests**: API routes with database
- **E2E Tests**: Playwright (critical user journeys)

## Future Enhancements

1. **Phase 2**: Notifications, email digests, progress reminders
2. **Phase 3**: Video hosting, interactive assessments, certificates
3. **Phase 4**: Member forums, peer collaboration, live events
4. **Phase 5**: Advanced analytics, member engagement metrics
5. **Phase 6**: Mobile app, offline mode, advanced search

## Documentation References

- [DATABASE.md](./DATABASE.md) - Database schema and RLS policies
- [SETUP.md](./SETUP.md) - Development environment setup
- [README.md](./README.md) - Project overview and quick start
