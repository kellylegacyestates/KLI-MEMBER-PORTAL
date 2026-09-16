# Kelly Legacy Institute Institutional Platform

## System Architecture

**Document Class:** Technical Architecture
**System:** Kelly Legacy Institute Institutional Platform
**Current Architecture:** Next.js + Firebase + Firestore
**Deployment Target:** Firebase App Hosting
**Current Program:** Phase 4 — Institutional Platform
**Status:** Active Architecture
**Institution:** Kelly Legacy Institute

---

## 1. Purpose

This document defines the current technical architecture of the Kelly Legacy Institute Institutional Platform and distinguishes implemented infrastructure from planned institutional capabilities.

The platform began as the KLI Member Portal and is evolving into a broader institutional environment supporting:

- education
- research
- publications
- institutional record governance
- matter administration
- evidence governance
- executive review
- document intelligence
- Legacy Document Intelligence Engine™ integration

This document describes the architecture that governs implementation.

Historical Supabase, PostgreSQL, Row Level Security, Vercel, and related architecture previously documented in this repository are not part of the current authoritative platform architecture unless expressly reintroduced through an approved architecture change.

---

## 2. Institutional Control Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

Technical implementation must remain subordinate to approved institutional architecture and record-governance requirements.

The following distinctions must remain explicit:

```text
CURRENT IMPLEMENTATION
≠
PLANNED IMPLEMENTATION

MACHINE FINDING
≠
INSTITUTIONAL DETERMINATION

RECEIVED EVIDENCE
≠
AUTHENTICATED EVIDENCE

EXTRACTED AUTHORITY
≠
VERIFIED AUTHORITY
```

No interface, background process, persistence layer, or machine-analysis subsystem may silently redefine these distinctions.

---

## 3. Current Technology Stack

| Layer | Current Technology |
|---|---|
| Application Framework | Next.js 16 App Router |
| UI Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Firebase Authentication |
| Trusted Server Authentication | Firebase Admin SDK |
| Session Model | Server-side Firebase session cookies |
| Database | Cloud Firestore |
| Authorization Enforcement | Server-side checks + Firebase Security Rules |
| Hosting | Firebase App Hosting |
| Runtime | Node.js 22 |
| Package Manager | pnpm 10 |
| Testing | Vitest |
| Linting | ESLint |
| CI | GitHub Actions |

The repository's `package.json` and lockfile remain authoritative for exact dependency and runtime versions.

---

## 4. High-Level Platform Architecture

The institutional platform is organized into six logical layers:

```text
                    KELLY LEGACY INSTITUTE
                              │
                 INSTITUTIONAL PLATFORM
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    EDUCATION              RECORDS               RESEARCH
        │                     │                     │
    Courses               Matters             Publications
    Curriculum            Evidence            Authorities
    Scholars              Deadlines           Briefings
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                             LDIE
                              │
                    DOCUMENT INTELLIGENCE
                              │
                   EXECUTIVE HUMAN REVIEW
```

The six operational layers are:

1. Public Institutional Layer
2. Fiduciary Scholar Layer
3. Institutional Record Layer
4. Legacy Document Intelligence Engine™
5. Executive Review Layer
6. Administrative Layer

---

## 5. Public Institutional Layer

The public layer may expose approved institutional resources such as:

- public publications
- public research
- institutional briefings
- educational material
- institutional information
- authentication entry points

Public availability must be explicit.

The presence of a record in Firestore does not itself make that record public.

---

## 6. Fiduciary Scholar Layer

The authenticated scholar/member experience includes or may include:

- dashboard
- curriculum
- courses
- publications
- research materials
- briefings
- downloads
- bookmarks
- certificates
- profile and account functions

Scholar-facing presentation must not bypass server authorization or Firestore Security Rules.

---

## 7. Institutional Record Layer

The institutional record layer is the planned governed system of record for structured administrative and analytical matters.

The canonical domain is intended to include:

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

At the current phase, these records are architectural targets unless separately identified as already implemented.

No planned collection or domain object should be represented as production-complete solely because it appears in this architecture.

---

## 8. Current Authentication Architecture

Firebase Authentication provides identity.

Firebase Admin provides trusted server-side authentication and authorization support.

The current authorization chain is:

```text
IDENTITY
    ↓
SESSION
    ↓
USER PROFILE
    ↓
ACCOUNT STATUS
    ↓
MEMBERSHIP STATUS
    ↓
ROLE
    ↓
AUTHORIZED RESOURCE
```

Authorization defaults to deny where required information is:

- missing
- malformed
- unknown
- inactive
- unauthorized
- inconsistent

---

## 9. Current Institutional Roles

The current application recognizes these principal roles:

```text
member
executive
admin
```

### Member

Active member access requires:

- valid server session
- institutional user profile
- active account
- active membership

### Executive

Executive access requires otherwise valid institutional access plus role:

```text
executive
OR
admin
```

### Administrator

Administrative access requires:

```text
admin
```

Administrative authorization is validated by trusted server-side code.

Client-rendered controls do not establish administrative authority.

---

## 10. Session Architecture

The application uses server-issued Firebase session cookies.

Session controls include:

- server-side session verification
- revocation-aware verification
- secure logout
- sign-out-all-devices capability
- administrative session revocation
- request-safety checks
- redirect validation
- rate-limiting support
- login diagnostics
- audit-event support

The browser is not trusted to determine authorization state.

---

## 11. Current Firestore Architecture

Cloud Firestore is the authoritative database for implemented platform features.

Currently implemented principal collections include:

```text
users/{uid}
auditEvents/{eventId}
publications/{publicationId}
```

All other collections are denied by default unless explicitly authorized through Firebase Security Rules.

### users

The `users` collection stores institutional user-profile and access-governance information.

Protected fields include:

- role
- accountStatus
- membershipStatus
- uid
- email
- createdAt

Member-controlled profile updates are restricted.

### auditEvents

The `auditEvents` collection is reserved for trusted server-side security and governance records.

Browser reads and writes are denied.

### publications

The `publications` collection is the canonical KLI Publications Registry.

A single stable institutional publication ID represents one publication across versions and distribution channels.

Public reads require explicit public visibility.

Administrative writes require authorized administrative status.

---

## 12. Publications Registry Architecture

Canonical path:

```text
publications/{publicationId}
```

The publication record may contain:

- institutional ID
- slug
- title
- subtitle
- publication type
- publication date
- authors
- institution
- abstract
- keywords
- visibility
- status
- current version
- version history
- identifiers
- distribution records
- rights information
- preferred citation
- institutional call-to-action
- timestamps

Versions remain associated with the canonical publication identity rather than being treated as unrelated publications.

---

## 13. Data-Access Architecture

Trusted business operations should follow this direction:

```text
UI / ROUTE
    ↓
APPLICATION SERVICE
    ↓
DOMAIN RULE
    ↓
DATA ACCESS / REPOSITORY
    ↓
FIRESTORE OR OTHER INFRASTRUCTURE
```

The user interface must not become the authoritative business-logic layer.

This separation supports future:

- web clients
- mobile clients
- enterprise integrations
- APIs
- background workers
- document-processing services

without requiring duplication of institutional logic.

---

## 14. Planned Multi-Tenant Architecture

The platform is being designed to support both internal KLI operations and future external institutional customers.

The planned tenancy hierarchy is:

```text
Organization
    ↓
Workspace
    ↓
Matter
```

Future governed records should be capable of carrying:

```text
organizationId
workspaceId
```

where appropriate.

This allows one platform architecture to support:

- KLI internal work
- individual professional users
- research organizations
- fiduciary offices
- legal or compliance teams
- institutional customers

without forking the codebase.

Multi-tenant persistence is planned architecture and is not yet represented as completed production functionality unless separately implemented and verified.

---

## 15. Planned Institutional Domain Architecture

The institutional domain layer should remain infrastructure-independent.

Expected future location:

```text
src/domain/
```

The domain layer must not depend directly upon:

```text
React
Next.js pages
Firebase client SDK
Firebase Admin SDK
Firestore
UI components
```

Infrastructure adapters may depend upon the domain.

The domain must not depend upon infrastructure adapters.

---

## 16. Matter Architecture

The planned `Matter` record is the canonical administrative container for an institutional matter.

Possible matter categories include:

- administrative matters
- rulemakings
- public-records requests
- litigation matters
- regulatory matters
- trust-governance matters
- estate-governance matters
- research matters
- financial-administration matters
- internal governance matters

The planned institutional analytical sequence is:

```text
AUTHORITY
    ↓
CAPACITY
    ↓
PROCEDURE
    ↓
REQUEST OR ACTION
    ↓
ACTOR / AGENCY ACTION
    ↓
EVIDENCE
    ↓
DETERMINATION
    ↓
REVIEW
    ↓
REMEDY
```

---

## 17. Planned Matter Lifecycle

The planned controlled lifecycle is:

```text
DRAFT
OPEN
AWAITING_ACTION
AWAITING_RESPONSE
UNDER_REVIEW
DETERMINED
ON_REVIEW
CLOSED
ARCHIVED
```

Unknown values must fail closed.

Terminal status must not be inferred from missing data.

---

## 18. Party and Capacity Architecture

Party identity and institutional capacity are distinct concepts.

A Party answers:

```text
WHO OR WHAT IS THE ACTOR?
```

Capacity answers:

```text
IN WHAT ROLE DID THAT ACTOR OPERATE?
```

A single party may possess different capacities in different matters.

The system must not infer legal, fiduciary, administrative, representative, or adjudicative capacity solely from identity.

---

## 19. Evidence Architecture

The planned evidence lifecycle distinguishes:

```text
IDENTIFIED
REQUESTED
RECEIVED
AUTHENTICATED
ADMITTED
REJECTED
SUPERSEDED
PRESERVED
```

These states are intentionally distinct.

```text
RECEIVED ≠ AUTHENTICATED
AUTHENTICATED ≠ ADMITTED
STORED ≠ PROVEN
```

Machine processing may identify candidate evidence and integrity concerns.

Machine processing does not independently authenticate evidence for institutional purposes.

---

## 20. Record Integrity

Planned record-integrity states include:

```text
UNREVIEWED
VERIFIED
QUALIFIED
DISPUTED
DEFECTIVE
```

Machine analysis may propose integrity concerns.

Final institutional verification status remains subject to authorized human review where required.

---

## 21. Authority Architecture

Authority records are intended to distinguish structured attributes such as:

- citation
- authority type
- jurisdiction
- issuing body
- title
- effective date
- status
- delegation
- duty
- procedure
- review rights
- remedy
- supporting evidence
- verification status

An extracted citation is not automatically verified authority.

---

## 22. Deadline Architecture

A date is not automatically an institutional deadline.

Controlled deadlines should ultimately record:

- deadline type
- matter
- due date
- triggering event
- authority basis
- calculation method
- supporting evidence
- status
- satisfaction date
- satisfying evidence

Machine extraction may identify candidate dates.

Institutional deadline status requires support from the record.

---

## 23. Determination Architecture

A Determination is an institutional record.

It is not equivalent to:

- a machine summary
- a classification
- a retrieval result
- an LDIE finding
- a draft analytical conclusion

Determinations may ultimately record:

- issuing actor
- issuing capacity
- issue date
- effective date
- authority basis
- evidence relied upon
- findings
- disposition
- review availability
- review deadline
- provenance

---

## 24. Review Architecture

Planned review states are:

```text
NOT_AVAILABLE
AVAILABLE
PENDING
FILED
DECIDED
EXHAUSTED
```

Review exhaustion must not be inferred merely because time has elapsed or no additional record was located.

---

## 25. Remedy Architecture

Remedy records may ultimately include:

- remedy type
- authority basis
- prerequisites
- status
- preservation date
- invocation date
- exhaustion date
- resulting determination
- supporting evidence
- provenance

Machine processing must not independently declare remedies exhausted.

---

## 26. Legacy Document Intelligence Engine™

The Legacy Document Intelligence Engine™ is a governed analytical subsystem.

LDIE may assist with:

- document intake
- text extraction
- metadata extraction
- document classification
- candidate-party identification
- candidate-capacity identification
- candidate-authority identification
- candidate-date identification
- candidate-deadline identification
- retrieval
- evidence relationship analysis
- integrity review
- analytical findings

LDIE may not independently:

```text
authenticate evidence
admit evidence
verify authority
establish capacity
close matters
issue institutional determinations
declare reviews exhausted
declare remedies exhausted
delete evidentiary history
delete audit history
override human disposition
bypass authorization
```

---

## 27. Machine Finding Architecture

Planned machine-finding states include:

```text
PROPOSED
UNDER_REVIEW
ADOPTED
REJECTED
SUPERSEDED
```

Machine output begins as a proposal.

Institutional adoption requires an authorized human action.

Machine findings should preserve provenance sufficient to identify:

- source run
- source evidence
- generation time
- processor version
- confidence
- reviewer
- review time
- disposition

---

## 28. Provenance Architecture

Governed records should preserve source provenance.

Expected provenance fields may include:

- source type
- source identifier
- created by
- created at
- creation method
- source evidence identifiers
- machine-run identifier

Planned creation methods include:

```text
HUMAN
IMPORT
SYSTEM
LDIE_PROPOSAL
```

`LDIE_PROPOSAL` does not indicate institutional adoption.

---

## 29. Audit Architecture

Sensitive actions should produce protected audit records.

Examples include:

- authorization changes
- session revocation
- record creation
- record modification
- status transitions
- review
- adoption
- rejection
- supersession
- record linking
- archival actions

Audit history must not be ordinary user-editable application content.

---

## 30. Deployment Architecture

Current deployment target:

```text
GitHub
    ↓
Firebase App Hosting
    ↓
Cloud Run managed runtime
    ↓
Firebase / Google Cloud services
```

Repository deployment configuration includes:

```text
apphosting.yaml
.firebaserc
firebase.json
```

Application Default Credentials or runtime service identity should be preferred for trusted Firebase Admin execution.

Server secrets must not be exposed through browser-visible environment variables.

---

## 31. Environment Separation

The architecture should evolve toward explicit:

```text
development
staging
production
```

environment separation.

Production credentials and institutional data must not be used casually in local development.

Infrastructure-specific environment configuration must remain outside application source code where possible.

---

## 32. CI Architecture

GitHub Actions provides automated repository validation.

The required controlled validation target is:

```text
pnpm test
pnpm lint
pnpm build
```

A controlled change is not conforming when required validation fails.

CI must not silently ignore failed tests.

---

## 33. Security Architecture

The governing security principles are:

```text
DENY BY DEFAULT

SERVER AUTHORIZATION CONTROLS ACCESS

CLIENT UI DOES NOT ESTABLISH AUTHORITY

UNKNOWN STATUS FAILS CLOSED

INVALID STATUS FAILS CLOSED

PRIVILEGED CHANGES REQUIRE TRUSTED SERVER EXECUTION

AUDIT HISTORY IS NOT ORDINARY USER CONTENT

MACHINE OUTPUT DOES NOT EQUAL INSTITUTIONAL DETERMINATION
```

---

## 34. Scalability Architecture

The platform should scale through shared institutional services rather than duplicate product-specific infrastructure.

Target shared capabilities include:

- identity
- authorization
- organization management
- workspace management
- entitlements
- audit
- search
- notifications
- document storage
- usage metering
- analytics
- external integrations

The governing scalability principle is:

> **SCALE THROUGH STANDARDIZATION. CUSTOMIZE AT THE EDGE. GOVERN THE CORE.**

---

## 35. Configuration Over Forking

Customer-specific or institutional variation should be represented through configuration where practicable.

Examples include:

- branding
- permissions
- enabled features
- retention rules
- workflow templates
- matter types
- notification rules

Separate customer codebases should not be the default scaling strategy.

---

## 36. Background Processing

Long-running document-intelligence tasks should not depend upon a browser request remaining open.

Future asynchronous processing should support states such as:

```text
QUEUED
RUNNING
SUCCEEDED
FAILED
CANCELLED
```

Candidate asynchronous workloads include:

- document ingestion
- extraction
- indexing
- classification
- large retrieval operations
- LDIE analysis
- notifications
- external synchronization

---

## 37. Storage Separation

The architecture should preserve distinctions among:

```text
structured record metadata
document binaries
search indexes
machine outputs
audit history
```

Firestore should not be treated as a binary document store.

Future document binaries should use appropriate object storage.

Search and retrieval infrastructure may evolve independently from the canonical institutional record.

---

## 38. Observability

Future production operations should measure:

- authentication failures
- authorization failures
- request latency
- application errors
- background-job failures
- Firestore usage
- document-processing volume
- LDIE runs
- search performance
- review latency
- deployment failures

Observability data does not itself redefine authoritative institutional records.

---

## 39. Historical Architecture

Earlier repository documentation described:

- Supabase PostgreSQL
- Supabase Auth
- Row Level Security
- Vercel
- React Query
- Supabase migrations
- Supabase Storage
- Vercel Analytics
- JWT/RLS-centered authorization

Those components are historical architecture and are not authoritative for the current implementation.

Historical design information may be preserved for provenance, but must be clearly labeled and must not be presented as active setup or deployment instruction.

---

## 40. Architecture Change Control

Material changes to any of the following require controlled review:

- authentication architecture
- authorization architecture
- institutional domain definitions
- Firestore collection semantics
- evidence states
- authority states
- determination semantics
- review semantics
- remedy semantics
- LDIE governance boundaries
- audit architecture
- tenancy model
- deployment architecture

Implementation convenience alone is not sufficient authority to redefine the institutional model.

---

## 41. Current Phase 4 Sequence

The controlled Phase 4 sequence is:

```text
P4-W01 — Architecture Baseline and Documentation Reconciliation

P4-W02 — Institutional Domain Model

P4-W03 — Multi-Tenant / Workspace Foundation

P4-W04 — Matter Registry Persistence

P4-W05 — Evidence and Authority Registry

P4-W06 — Matter Control Interface

P4-W07 — LDIE Integration

P4-W08 — Executive Review and Scholar Integration

P4-W09 — Security, Observability, and Scalability Closure

P4-W10 — Production Verification
```

Each work unit must distinguish planned implementation from completed implementation.

---

## 42. Governing Documentation

The principal technical documentation includes:

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

Where conflict exists, it must be treated as an architecture defect and corrected through controlled review.

---

## 43. Governing Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

This principle controls the development of the Kelly Legacy Institute Institutional Platform and the Legacy Document Intelligence Engine™.

---

## P4-W08 — LDIE Integration Boundary

The Legacy Document Intelligence Engine (LDIE) operates as a governed analytical subsystem.

LDIE may analyze source material, generate candidate findings, persist PROPOSED MachineFinding records, and append corresponding AuditEvent records.

LDIE does not possess institutional disposition authority.

### LDIE Authority Boundary

LDIE MAY:

- analyze source material
- generate candidate findings
- persist PROPOSED MachineFinding records
- append matching LDIE AuditEvent records
- return references to persisted analytical records

LDIE MUST NOT:

- issue a Determination
- close a Matter
- mark Review exhausted
- mark Remedy exhausted
- authenticate Evidence independently
- verify Authority independently
- adopt its own MachineFinding
- delete or rewrite AuditEvent history

**Machine output ≠ institutional determination.**

**Persisted finding ≠ adopted finding.**

---

## P4-W09 — Executive MachineFinding Review

Executive review is a human-controlled institutional function layered above LDIE-generated MachineFinding records.

The authorized lifecycle is:

```text
PROPOSED
   |
   v
UNDER_REVIEW
   |
   +--> ADOPTED
   +--> REJECTED
   +--> SUPERSEDED
```

Executive review requires an authorized executive or administrator with active membership.

Reviewer identity and review timestamp are recorded on the MachineFinding.

Each successful review-state transition is accompanied by a USER AuditEvent.

The review service does not issue a Determination, close a Matter, exhaust Review, exhaust Remedy, authenticate Evidence, or independently verify Authority.

**Human MachineFinding disposition ≠ institutional Determination.**

**ADOPTED ≠ adjudicated.**

**REJECTED ≠ Matter closed.**

**SUPERSEDED ≠ deleted.**

---

## Phase 4 Implementation Reconciliation

The Phase 4 institutional record architecture has progressed beyond the earlier planning descriptions in this document.

The following capabilities are now implemented as trusted server-side institutional infrastructure:

- Organization and Workspace scoping
- Membership scope validation
- Matter persistence
- Evidence persistence
- Authority persistence
- Communication persistence
- Deadline persistence
- Determination persistence
- Review persistence
- Remedy persistence
- MachineFinding persistence
- append-only AuditEvent persistence
- governed LDIE MachineFinding submission
- authorized executive MachineFinding review and disposition

Browser access to these institutional record chains remains denied by Firestore Security Rules.

MachineFinding disposition remains distinct from Determination issuance, Matter closure, Review exhaustion, and Remedy exhaustion.

Where earlier sections describe these specific Phase 4 capabilities as planned, this reconciliation section controls their implementation status.

**THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**
