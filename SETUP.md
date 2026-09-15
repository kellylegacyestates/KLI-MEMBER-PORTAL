# Kelly Legacy Institute Institutional Platform

## Development and Deployment Setup Guide

**Document Class:** Development Setup
**System:** Kelly Legacy Institute Institutional Platform
**Current Stack:** Next.js + Firebase + Firestore
**Deployment Target:** Firebase App Hosting
**Runtime:** Node.js 22
**Package Manager:** pnpm 10
**Status:** Active Setup Guide

---

## 1. Purpose

This guide defines the current development, validation, and deployment setup for the Kelly Legacy Institute Institutional Platform.

The current implementation uses:

```text
Next.js
React
TypeScript
Firebase Authentication
Firebase Admin SDK
Cloud Firestore
Firebase Security Rules
Firebase App Hosting
```

Historical setup instructions involving Supabase, PostgreSQL, Supabase migrations, or Vercel are obsolete and must not be used for the current platform.

---

## 2. Governing Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

Setup instructions must match the actual repository.

Commands that do not exist in `package.json` must not be documented as current commands.

Historical infrastructure must not be represented as active infrastructure.

---

## 3. Current Repository

Repository:

```text
https://github.com/kellylegacyestates/KLI-MEMBER-PORTAL
```

Clone:

```bash
git clone https://github.com/kellylegacyestates/KLI-MEMBER-PORTAL.git
cd KLI-MEMBER-PORTAL
```

---

## 4. Required Runtime

The repository currently requires:

```text
Node.js 22.x
pnpm 10.28.1
```

Confirm:

```bash
node --version
pnpm --version
```

Expected Node major version:

```text
22
```

Expected pnpm version:

```text
10.28.1
```

Where Corepack is available:

```bash
corepack enable
corepack prepare pnpm@10.28.1 --activate
```

---

## 5. Install Dependencies

Install from the committed lockfile:

```bash
pnpm install --frozen-lockfile
```

Do not casually regenerate the lockfile during documentation or unrelated controlled work.

---

## 6. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

The Firebase Web SDK values are browser-visible by design and use the `NEXT_PUBLIC_` prefix.

Typical client values include:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Trusted server configuration must not be exposed through `NEXT_PUBLIC_*`.

---

## 7. Firebase Admin Configuration

Trusted server operations use the Firebase Admin SDK.

Preferred production model:

```text
Firebase App Hosting runtime identity
+
Application Default Credentials
```

Where the runtime already provides the Google Cloud project identity, explicit service-account credentials may not be required.

Optional server-only configuration may include:

```env
FIREBASE_ADMIN_PROJECT_ID=
```

For environments where explicit credentials are proven necessary:

```env
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

These values must remain server-only.

Never commit:

- service-account JSON files
- private keys
- secrets
- production credentials

---

## 8. Local Development Authentication

For local trusted Firebase Admin execution, use one of the following approved approaches.

### Option A — Application Default Credentials

Authenticate with Google Cloud tooling in a trusted development environment.

### Option B — Server-Only Environment Variables

Provide authorized server-only Firebase Admin values through `.env.local`.

Do not expose Firebase Admin credentials to browser code.

---

## 9. Start Development Server

Run:

```bash
pnpm dev
```

Default local URL:

```text
http://localhost:3000
```

---

## 10. Current Package Commands

The repository currently defines:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm provision:admins
pnpm seed:publications
```

Do not use or document unsupported commands such as:

```text
pnpm type-check
pnpm test:coverage
pnpm test:e2e
```

unless those scripts are formally added to `package.json`.

---

## 11. Baseline Validation

Before beginning a controlled work unit:

```bash
pnpm test
pnpm lint
pnpm build
```

Record:

- branch
- starting commit
- runtime versions
- test result
- lint result
- build result
- working-tree state

A dirty baseline must be explained before implementation proceeds.

---

## 12. Controlled Work Branch

Do not perform substantial controlled work directly on `main`.

Example:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b docs/p4-w01b-architecture-reconciliation
```

Use descriptive branch names tied to the controlled work unit.

---

## 13. Git Status Discipline

Before implementation:

```bash
git status --short
```

Untracked or modified files must be classified before continuing.

Do not silently:

- delete unknown files
- commit generated artifacts
- mix unrelated local artifacts into a controlled change

---

## 14. Build

Production build:

```bash
pnpm build
```

The build must complete without fatal errors before the work unit may be considered conforming.

---

## 15. Lint

Run:

```bash
pnpm lint
```

Lint failures must be corrected or explicitly recorded as pre-existing defects.

---

## 16. Tests

Run:

```bash
pnpm test
```

The current repository uses Vitest.

A controlled work unit must not claim test success when tests were skipped or failed.

---

## 17. CI

GitHub Actions should validate:

```bash
pnpm test
pnpm lint
pnpm build
```

CI is expected to run on:

```text
pull requests to main
pushes to main
```

A pull request should not be considered conforming if required CI fails.

---

## 18. Firebase Project

The current Google Cloud / Firebase project is:

```text
legacy-ai-production
```

Before performing Firebase or Google Cloud operations, confirm the active project:

```bash
gcloud config get-value project
```

Where necessary:

```bash
gcloud config set project legacy-ai-production
```

Do not assume the active Cloud Shell project is correct without verification.

---

## 19. Firebase App Hosting

The current deployment target is Firebase App Hosting.

Repository configuration includes:

```text
apphosting.yaml
.firebaserc
firebase.json
```

The application is not currently documented as a Vercel deployment.

Vercel-specific deployment instructions are historical and should not be used unless formally reintroduced.

---

## 20. App Hosting Environment

`apphosting.yaml` contains build/runtime configuration for Firebase App Hosting.

Browser-visible Firebase Web SDK values may be available at both build and runtime.

Trusted server secrets should use runtime identity or managed secret infrastructure rather than browser-visible variables.

Do not place sensitive credentials directly in source control.

---

## 21. Firestore

Cloud Firestore is the current authoritative datastore.

Current implemented principal collections include:

```text
users
auditEvents
publications
```

New collections must not be assumed to exist merely because they are described in architecture documents.

Planned collections such as:

```text
organizations
workspaces
matters
evidence
authorities
deadlines
determinations
reviews
remedies
machineFindings
```

remain planned until separately implemented and verified.

---

## 22. Firestore Security Rules

Security rules are maintained in:

```text
firestore.rules
```

The current model is deny-by-default.

New browser-accessible collections require explicit rules.

Do not weaken the catch-all denial merely to make development easier.

---

## 23. Administrative Provisioning

The repository provides an administrative provisioning script.

Preview first:

```bash
pnpm provision:admins -- --dry-run
```

If the script's argument handling requires direct invocation, use the repository-supported documented form verified against the implementation.

Apply only from a trusted environment after dry-run review.

Administrative provisioning must not:

- create unauthorized identities
- expose credentials
- bypass email verification requirements
- silently change access without audit records

---

## 24. Publication Seeding

The repository provides:

```bash
pnpm seed:publications
```

Run only from an authorized trusted environment.

Canonical publication records must not be overwritten casually.

---

## 25. Development Data Safety

Development activity must avoid unnecessary interaction with production institutional data.

Prefer:

```text
development environment
staging environment
test fixtures
isolated records
```

The platform should continue evolving toward explicit environment separation:

```text
development
staging
production
```

---

## 26. Secrets

Secrets must not be:

- committed to Git
- pasted into source files
- exposed in client bundles
- stored in `NEXT_PUBLIC_*` values
- logged in CI output

Use trusted secret-management mechanisms for production.

---

## 27. Cloud Shell

Google Cloud Shell may be used for controlled development and administrative work.

Before beginning:

```bash
gcloud config get-value project
git status --short
git branch --show-current
git rev-parse HEAD
node --version
pnpm --version
```

Cloud Shell local artifacts must not automatically be committed to the repository.

---

## 28. Generated Local Artifacts

Tools may generate files such as:

```text
.agents/
build-details.json
skills-lock.json
```

These files must be classified before inclusion.

If they are local tool artifacts, preserve or remove them outside the repository as appropriate.

Do not automatically commit generated artifacts without architectural review.

---

## 29. Agent-Assisted Development

AI coding agents may assist with implementation.

They must operate under controlled scope.

Before changing code, agents should read:

```text
README.md
ARCHITECTURE.md
DATABASE.md
SETUP.md
AGENTS.md
CLAUDE.md
docs/governance/
```

Agents must not:

- redefine architecture independently
- weaken authorization
- bypass tests
- treat machine output as institutional determination
- write directly to production
- merge without review
- introduce unrelated changes

---

## 30. Development Workflow

Recommended controlled workflow:

```text
1. Sync main
2. Create bounded work branch
3. Record starting commit
4. Run baseline validation
5. Implement authorized scope
6. Run tests
7. Run lint
8. Run build
9. Review git diff
10. Run git diff --check
11. Commit
12. Push branch
13. Open pull request
14. Review CI
15. Human review
16. Merge
```

---

## 31. Pre-Commit Review

Before committing:

```bash
git status --short
git diff --stat
git diff --check
git diff
```

Confirm:

- only authorized files changed
- no secrets appear
- no generated artifacts were accidentally added
- no unrelated source files changed
- documentation reflects implementation accurately

---

## 32. Commit

Example:

```bash
git add ARCHITECTURE.md DATABASE.md SETUP.md
git commit -m "docs: reconcile platform architecture and setup"
```

Do not use this example blindly if additional authorized files are part of the same controlled work unit.

---

## 33. Push

Push the controlled branch:

```bash
git push -u origin <branch-name>
```

Do not force-push unless there is a specific reviewed reason.

---

## 34. Pull Request

The pull request should document:

- objective
- starting commit
- files changed
- implementation scope
- validation results
- known defects
- scope deviations
- conformity result

The pull request description becomes part of the implementation record.

---

## 35. Production Deployment

Production deployment should occur only after:

- required tests pass
- lint passes
- build passes
- CI passes
- security review is complete
- required environment configuration is verified
- controlled work is merged
- production release is authorized

Documentation changes alone do not require production deployment unless they are part of a separately approved release.

---

## 36. Historical Supabase Instructions

Earlier repository documentation included:

- Supabase Auth
- PostgreSQL
- SQL migrations
- Row Level Security
- service-role keys
- Supabase local stack
- Supabase staging projects

Those instructions are historical.

They are not current setup requirements.

---

## 37. Historical Vercel Instructions

Earlier repository documentation included:

- Vercel deployment
- Vercel environment variables
- Vercel Analytics
- Vercel Edge Network

Those instructions are historical.

The current deployment target is Firebase App Hosting.

---

## 38. Historical Stripe Instructions

Earlier repository documentation included active Stripe setup instructions.

Stripe should only be documented as current infrastructure where implementation evidence confirms the integration is active and required.

Do not configure Stripe solely because historical documentation referenced it.

---

## 39. Troubleshooting

### Wrong Node Version

If the repository reports an unsupported engine:

```bash
nvm install 22
nvm use 22
```

Confirm:

```bash
node --version
```

### Dependency Problems

Reinstall under the supported runtime:

```bash
rm -rf node_modules
pnpm install --frozen-lockfile
```

### Dirty Working Tree

Inspect:

```bash
git status --short
```

Classify unexpected files before editing or committing.

### Firebase Admin Errors

Confirm:

- active project
- runtime identity
- required environment configuration
- server-only credential handling

Do not bypass authentication checks to resolve configuration errors.

---

## 40. Required Validation Before Merge

Run:

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
```

Required result:

```text
TEST  PASS
LINT  PASS
BUILD PASS
DIFF CHECK PASS
```

---

## 41. Governing Documentation

Current principal technical documentation:

```text
README.md
ARCHITECTURE.md
DATABASE.md
SETUP.md
AGENTS.md
CLAUDE.md
docs/governance/
```

These documents must remain mutually consistent.

---

## 42. Governing Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**
