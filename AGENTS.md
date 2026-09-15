<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repository uses Next.js 16 and may contain APIs, conventions, and file structures that differ from older Next.js versions.

Before modifying Next.js behavior, inspect the repository implementation and the relevant documentation available in the installed Next.js package.

Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Kelly Legacy Institute Agent Rules

## Institutional Control Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

All coding agents working in this repository must operate within the controlled institutional architecture.

## Required Reading

Before modifying code or documentation, read:

```text
README.md
ARCHITECTURE.md
DATABASE.md
SETUP.md
AGENTS.md
CLAUDE.md
docs/governance/
```

Do not rely on assumptions derived from older repository architecture.

## Current Authoritative Stack

The current platform uses:

```text
Next.js 16
React 19
TypeScript
Firebase Authentication
Firebase Admin SDK
Cloud Firestore
Firebase Security Rules
Firebase App Hosting
Node.js 22
pnpm 10
Vitest
ESLint
```

Supabase, PostgreSQL, Row Level Security, and Vercel references are historical unless explicitly reintroduced through approved architecture change.

## Controlled Scope

Work only within the explicitly authorized work unit.

Do not:

- modify unrelated files
- expand scope without approval
- redesign architecture for convenience
- introduce new infrastructure without approval
- modify production configuration unless authorized
- silently alter institutional semantics
- mix cleanup, refactoring, and feature work into one controlled unit unless authorized

## Branch Discipline

Do not perform substantial work directly on `main`.

Use a dedicated branch for each controlled work unit.

Record:

- starting commit
- branch
- files created
- files modified
- files deleted
- validation results
- known defects
- scope deviations
- ending commit

## Authorization

Do not weaken fail-closed authorization.

Do not replace server-side authorization with client-side UI checks.

Do not assume that a rendered button, route, or client state establishes authority.

Unknown or invalid authorization state must fail closed.

## Firestore

Current implemented principal collections are:

```text
users
auditEvents
publications
```

Other institutional collections are planned unless separately implemented and verified.

Do not create or expose new collections casually.

New browser-accessible collections require explicit Firebase Security Rule review.

The default-deny posture must remain intact.

## Institutional Domain Boundary

The planned institutional domain includes:

```text
Organization
Workspace
Membership
RoleAssignment
Entitlement
Matter
Party
Capacity
Authority
Evidence
Communication
Deadline
Determination
Review
Remedy
AuditEvent
MachineFinding
```

Do not collapse distinct concepts merely for implementation convenience.

Examples:

```text
Party ≠ Capacity
Received Evidence ≠ Authenticated Evidence
Extracted Authority ≠ Verified Authority
Machine Finding ≠ Institutional Determination
```

## LDIE Governance

The Legacy Document Intelligence Engine™ is an analytical subsystem.

LDIE may produce candidate findings.

LDIE must not independently:

- authenticate evidence
- admit evidence
- verify authority
- establish legal or institutional capacity
- close matters
- issue institutional determinations
- declare review exhausted
- declare remedies exhausted
- delete evidentiary history
- delete audit history
- override human disposition
- bypass authorization

Human institutional review remains controlling where required.

## Audit Integrity

Audit history must not be treated as ordinary editable application content.

Do not add ordinary browser write access to `auditEvents`.

Do not silently rewrite or delete protected audit records.

## Secrets

Never commit:

- service-account JSON
- private keys
- API secrets
- credentials
- production tokens

Do not expose server credentials through `NEXT_PUBLIC_*`.

## Validation

Before declaring work complete, run:

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
```

Do not report a validation step as passing if it was skipped or failed.

## Final Work Report

Every substantial controlled implementation should report:

```text
Starting Commit
Ending Commit
Branch
Files Created
Files Modified
Files Deleted
Tests Added or Modified
Test Result
Lint Result
Build Result
Diff Check Result
Known Defects
Scope Deviations
Conformity Determination
```

## Conformity

A change is not conforming merely because it compiles.

Conformity requires:

- authorized scope
- architecture alignment
- security preservation
- validation success
- accurate documentation
- no undisclosed deviations
