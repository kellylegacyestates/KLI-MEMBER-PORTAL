# Kelly Legacy Institute Institutional Platform

> Secure learning, research, publication, record-governance, and institutional knowledge infrastructure for Kelly Legacy Institute.

## Overview

**Repository:** `kellylegacyestates/KLI-MEMBER-PORTAL`  
**Target Production Domain:** https://access.kellylegacyestates.com  
**Deployment Target:** Firebase App Hosting  
**Current Status:** Active Development  
**Architecture:** Next.js + Firebase + Firestore  
**Current Controlled Program:** Phase 4 — Institutional Platform

The Kelly Legacy Institute Institutional Platform is the secure digital operating environment for Kelly Legacy Institute.

The project began as the KLI Member Portal for delivery of curriculum, publications, research materials, and member resources. Its mission has expanded into a broader institutional platform supporting education, research, publication, administrative record development, evidence governance, matter control, executive review, and machine-assisted document intelligence.

The platform is intended to support the institutional chain of authority, capacity, procedure, action, evidence, determination, review, and remedy while maintaining a clear distinction between authoritative institutional records and machine-assisted analytical output.

The Legacy Document Intelligence Engine™ operates within this architecture as an analytical subsystem. LDIE may ingest records, extract text and metadata, identify candidate authorities, identify candidate parties and capacities, identify candidate dates and deadlines, retrieve relevant evidence, surface integrity concerns, and produce analytical findings for human review.

LDIE output does not, by itself, constitute an institutional determination.

Human review remains required where institutional adoption, evidentiary authentication, authority verification, matter disposition, review exhaustion, remedy exhaustion, or other controlled institutional acts are concerned.

---

## Institutional Control Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

System behavior, source code, technical documentation, security controls, institutional records, and implementation status must remain aligned.

Where documentation and implementation conflict, the discrepancy must be identified, reviewed, and corrected.

Planned functionality must not be represented as implemented functionality.

Historical architecture must not be represented as current architecture.

Machine-derived findings must not be represented as adopted institutional findings unless an authorized human review action establishes that status.

---

## Platform Mission

Kelly Legacy Institute is developing a governed institutional environment capable of supporting four interconnected functions:

1. Education
2. Research
3. Record Governance
4. Document Intelligence

### Education

The education layer supports structured instruction in fiduciary administration, record discipline, authority, capacity, procedure, evidence, review, and remedy.

Planned and current educational functions include:

- Fiduciary Scholar dashboards
- Courses
- Curriculum modules
- Briefings
- Research materials
- Publications
- Downloads
- Bookmarks
- Certificates
- Institutional learning pathways

### Research

The research layer is intended to support:

- Institutional publications
- Verified authorities
- Source records
- Research materials
- Public-records research
- Administrative research
- Legal research
- Governance research
- Institutional briefings
- Cross-matter authority analysis

### Record Governance

The record-governance layer is intended to maintain:

- Matters
- Parties
- Capacities
- Authorities
- Evidence
- Communications
- Deadlines
- Determinations
- Reviews
- Remedies
- Audit events
- Record-integrity findings
- Provenance

### Document Intelligence

The Legacy Document Intelligence Engine™ is intended to assist authorized institutional users with:

- Document intake
- Text extraction
- Metadata extraction
- Document classification
- Matter association
- Candidate authority identification
- Candidate party identification
- Candidate capacity identification
- Candidate date identification
- Candidate deadline identification
- Retrieval
- Evidence relationship analysis
- Integrity review
- Analytical findings

Machine assistance does not displace institutional human authority.

---

## Platform Architecture

The KLI Institutional Platform is organized around six principal operational layers:

1. Public Institutional Layer
2. Fiduciary Scholar Layer
3. Institutional Record Layer
4. Legacy Document Intelligence Engine™
5. Executive Layer
6. Administrative Layer

### Public Institutional Layer

The Public Institutional Layer may expose:

- Institutional publications
- Public research
- Public briefings
- Public educational materials
- Institutional information
- Authentication entry points

### Fiduciary Scholar Layer

Authenticated members may access:

- Scholar dashboard
- Curriculum
- Courses
- Research materials
- Publications
- Briefings
- Downloads
- Bookmarks
- Certificates
- Account management

### Institutional Record Layer

The Institutional Record Layer is intended to support governed records including:

- Matters
- Parties
- Capacities
- Authorities
- Evidence
- Communications
- Deadlines
- Determinations
- Reviews
- Remedies
- Audit events

### Legacy Document Intelligence Engine™

LDIE operates as the analytical and document-intelligence subsystem of the institutional platform.

LDIE may propose findings but does not possess independent institutional decisional authority.

### Executive Layer

Authorized executive users may ultimately perform functions including:

- Matter oversight
- Record-integrity review
- Institutional determination review
- Publication review
- Research governance
- LDIE finding review
- Adoption or rejection of machine findings
- Audit oversight
- Record disposition review

### Administrative Layer

Authorized administrators manage infrastructure and access-governance functions including:

- User accounts
- Roles
- Membership status
- Account status
- Session controls
- Privileged authorization changes
- Publication administration
- Audit records
- Institutional configuration

The intended institutional relationship is:

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

Education teaches the discipline.

Research establishes authorities and sources.

The Matter Registry maintains the institutional record.

LDIE assists with document intelligence.

Executive review preserves human institutional authority.

---

## Current Technology Stack

| Layer | Technology |
|---|---|
| Application Framework | Next.js 16 App Router |
| UI Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Firebase Authentication |
| Trusted Server Authentication | Firebase Admin SDK |
| Session Model | Server-side Firebase session cookies |
| Database | Cloud Firestore |
| Security Rules | Firebase Security Rules |
| Deployment Target | Firebase App Hosting |
| Runtime | Node.js 22 |
| Package Manager | pnpm 10 |
| Testing | Vitest |
| Linting | ESLint |

---

## Authentication and Access Governance

The current security model uses Firebase Authentication for identity and Firebase Admin for trusted server-side verification.

Protected application access is not granted merely because a Firebase identity exists.

The authorization chain evaluates:

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

Authorization defaults to deny when required identity, session, profile, status, or role information is missing or invalid.

### Current Institutional Roles

```text
member
executive
admin
```

### Member Authorization

Active member access requires:

- Valid Firebase session
- Existing institutional user profile
- Active account
- Active membership

### Executive Authorization

Executive access requires an otherwise authorized member whose role is:

```text
executive
OR
admin
```

### Administrative Authorization

Administrative access requires:

```text
admin
```

Administrative access remains subject to trusted server-side authorization checks.

---

## Session Security

The application contains server-side session-security controls including:

- Firebase session-cookie verification
- Revocation-aware session validation
- Session-establishment throttling
- Trusted logout handling
- Sign-out-all-devices capability
- Administrative session revocation
- Secure redirect handling
- Request-safety validation
- Login diagnostics
- Audit-event support

Session and authorization controls must remain server-enforced.

Client-side presentation logic must never be treated as sufficient authorization.

---

## Privileged Authorization Changes

Protected user authorization fields include:

```text
role
accountStatus
membershipStatus
```

These fields must be changed through approved trusted administrative workflows.

Protected-field changes must not rely on browser authority alone.

Administrative operations should validate:

- Active administrator identity
- Active administrator account status
- Administrator role
- Target institutional profile
- Requested transition
- Audit reason
- Applicable revocation requirements

Manual Firebase Console edits bypass normal application-level governance and should be treated as exceptional break-glass administration.

Any such intervention should be independently documented and reviewed.

---

## Administrative Session Revocation

Authorized administrators may revoke another user's Firebase sessions through trusted administrative workflows.

Administrative session revocation should require:

- Authenticated administrator
- Active administrative account
- Target user identity
- Operational or security reason

Where applicable, session-revocation actions should be recorded in the server-controlled audit architecture.

Administrators should not use ordinary administrative revocation workflows against their own account.

---

## Administrative Account Provisioning

Administrative access is provisioned against existing Firebase Authentication identities.

The provisioning utility does not create identities or passwords.

The repository provides:

```bash
corepack pnpm provision:admins --dry-run
corepack pnpm provision:admins
```

The dry-run should always be reviewed before applying changes.

Example trusted environment configuration:

```bash
export FIREBASE_ADMIN_PROJECT_ID="legacy-ai-production"
export ADMIN_PROVISIONING_EMAILS="office@kellylegacyestates.com,kellylegacyestatesllc@gmail.com"
```

`ADMIN_PROVISIONING_EMAILS` is server-only.

It must not use a `NEXT_PUBLIC_` prefix and must not be exposed to browser code.

Administrative provisioning should be performed only from a trusted environment with authorized Application Default Credentials.

---

## Current Application Areas

The repository currently contains application areas including:

```text
src/app/

access-denied/
account/
admin/
api/
billing/
bookmarks/
briefings/
certificates/
courses/
curriculum/
dashboard/
downloads/
executive/
forgot-password/
login/
publications/
register/
...
```

The existence of a route does not establish that every workflow behind that route is production-complete.

Current behavior must be determined from implementation, tests, and technical-governance evidence rather than route names alone.

---

## Publications Registry

Kelly Legacy Institute maintains an institutional Publications Registry in Cloud Firestore.

The canonical collection is:

```text
publications/{publicationId}
```

One canonical publication record represents one institutional publication across its lifecycle.

A publication record may maintain:

- Stable institutional publication ID
- Slug
- Title
- Subtitle
- Series
- Publication type
- Publication date
- Status
- Authors
- Institution
- Abstract
- Keywords
- Visibility
- Current version
- Version history
- External identifiers
- Distribution information
- Rights information
- Preferred citation
- Related institutional call-to-action

Publications may be public or private.

Public visibility must be explicit.

Administrative mutations require trusted administrative authorization.

The registry is designed so that a new version of an existing publication does not create an unrelated duplicate institutional identity.

---

## Institutional Content Status

Some educational and presentation content currently remains defined in static TypeScript structures.

Examples include portions of:

- Dashboard presentation data
- Curriculum modules
- Research entries
- Briefing entries
- Institutional resource listings

These static structures are transitional implementation data.

They must not be treated as authoritative institutional records merely because they are rendered by the application.

The platform architecture will progressively move governed institutional content into controlled persistent records.

---

## Planned Institutional Domain Model

The next major architecture layer introduces infrastructure-independent institutional domain objects.

Planned controlled record families include:

```text
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

These objects are intended to be defined independently from:

```text
Firebase
Firebase Admin
React
Next.js
UI components
route handlers
```

This separation prevents the user interface, storage implementation, or machine-processing subsystem from redefining the institutional record.

---

## Matter Registry

The Matter Registry is intended to become the principal institutional record-control system.

A Matter may represent:

- Administrative proceeding
- Rulemaking matter
- Public-records request
- Litigation matter
- Regulatory matter
- Trust-governance matter
- Estate-governance matter
- Financial-administration matter
- Institutional research matter
- Internal-governance matter
- Other controlled institutional matter

The Matter Registry is intended to organize the institutional analytical chain:

```text
AUTHORITY
    ↓
CAPACITY
    ↓
PROCEDURE
    ↓
REQUEST OR ACT
    ↓
ACTOR OR AGENCY ACTION
    ↓
EVIDENCE
    ↓
DETERMINATION
    ↓
REVIEW
    ↓
REMEDY
```

The Matter record should hold the controlling posture of a matter while supporting records remain separately governed and referenced.

---

## Matter Lifecycle

The planned controlled Matter lifecycle is:

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

Unknown lifecycle states must not silently resolve to a favorable or terminal state.

---

## Party and Capacity Separation

Identity and capacity are separate institutional concepts.

A Party answers:

> Who or what is the actor?

A Capacity answers:

> In what role was that actor operating?

A party may hold multiple capacities across one or more matters.

Capacity must not be inferred solely from identity.

This distinction is fundamental to the institutional data model because the same actor may appear in different representative, administrative, fiduciary, regulatory, custodial, or adjudicative capacities depending on the matter.

---

## Evidence Governance

Evidence will be treated as a first-class controlled institutional record.

The planned evidentiary lifecycle distinguishes among:

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

These states are not interchangeable.

```text
RECEIVED ≠ AUTHENTICATED

AUTHENTICATED ≠ ADMITTED

STORED ≠ PROVEN
```

Machine processing may identify evidence, metadata, relationships, or integrity concerns.

Machine processing may not independently authenticate evidence for institutional purposes.

---

## Record Integrity

Controlled records are intended to support explicit integrity states such as:

```text
UNREVIEWED
VERIFIED
QUALIFIED
DISPUTED
DEFECTIVE
```

Machine processing may identify a potential integrity issue.

Machine processing must not independently assign a final human verification status where institutional review is required.

---

## Authority Governance

Legal, regulatory, administrative, contractual, policy, and other governing authorities may ultimately be represented as structured institutional records.

An extracted citation does not automatically become verified authority.

Authority verification requires a controlled review process.

Authority records are intended to distinguish among:

- Citation
- Authority type
- Jurisdiction
- Issuing body
- Title
- Effective date
- Current status
- Delegation
- Duty
- Procedure
- Review rights
- Remedy
- Supporting evidence
- Matter associations
- Verification status

---

## Communications Governance

Formal communications may ultimately be represented as structured records associated with a Matter.

Communication records may track:

- Direction
- Communication type
- Sender
- Sender capacity
- Recipients
- Recipient capacities
- Subject
- Sent date
- Received date
- Service method
- Supporting evidence
- Response requirement
- Response deadline
- Provenance

A communication record should not be treated as proof of receipt merely because transmission was attempted.

---

## Deadline Governance

Controlled deadline records are intended to distinguish between an observed date and an institutional deadline.

A controlled deadline should be capable of recording:

- Deadline type
- Matter
- Due date
- Authority basis
- Triggering event
- Triggering evidence
- Status
- Satisfaction date
- Satisfying evidence
- Calculation method
- Notes
- Provenance

A date should not be represented as a controlled legal or administrative deadline unless its basis can be established in the record.

---

## Determination Governance

Institutional determinations are separate from machine-generated findings.

A determination may ultimately record:

- Matter
- Determination type
- Issuing party
- Issuing capacity
- Issue date
- Effective date
- Findings
- Authority basis
- Evidence relied upon
- Disposition
- Review availability
- Review deadline
- Source evidence
- Institutional status
- Provenance

Machine output is not automatically a Determination.

---

## Review Governance

The planned controlled review states are:

```text
NOT_AVAILABLE
AVAILABLE
PENDING
FILED
DECIDED
EXHAUSTED
```

Review exhaustion must not be inferred merely because time has elapsed or no additional record has been located.

Where review status affects rights, remedies, or institutional posture, human review remains required.

---

## Remedy Governance

Remedies may ultimately be represented as structured institutional records.

A remedy record may identify:

- Remedy type
- Matter
- Authority basis
- Prerequisites
- Status
- Preservation date
- Invocation date
- Exhaustion date
- Resulting determination
- Notes
- Provenance

Remedy exhaustion must not be declared solely by machine inference.

---

## LDIE Governance Boundary

The Legacy Document Intelligence Engine™ is an analytical subsystem.

LDIE may:

- Ingest documents
- Extract text
- Extract metadata
- Identify candidate parties
- Identify candidate capacities
- Identify candidate authorities
- Identify candidate dates
- Identify candidate deadlines
- Identify candidate evidence relationships
- Propose matter associations
- Perform retrieval
- Identify integrity issues
- Generate analytical findings

LDIE may not directly:

```text
authenticate evidence
admit evidence
verify authority
establish legal capacity
close a matter
issue institutional determinations
declare review exhausted
declare remedies exhausted
delete evidentiary records
delete audit history
override human disposition
bypass authorization
```

Machine-derived findings must remain distinguishable from adopted institutional findings.

---

## Machine Finding Lifecycle

Machine findings are intended to use controlled disposition states:

```text
PROPOSED
UNDER_REVIEW
ADOPTED
REJECTED
SUPERSEDED
```

An LDIE-generated result begins as machine output.

Institutional adoption requires an authorized human action.

A machine finding should retain sufficient provenance to establish:

- Source run
- Source evidence
- Generation time
- Processor version
- Confidence
- Review status
- Reviewer
- Review time
- Disposition

---

## Provenance

Controlled institutional records should maintain provenance sufficient to establish where a record or proposition originated.

Planned provenance fields may include:

- Source type
- Source identifier
- Created by
- Created at
- Creation method
- Source evidence identifiers
- Source machine-run identifier

Planned creation methods include:

```text
HUMAN
IMPORT
SYSTEM
LDIE_PROPOSAL
```

`LDIE_PROPOSAL` does not confer institutional adoption.

---

## Audit Architecture

Sensitive institutional actions are designed to produce audit records.

Audit-controlled activity includes or may include:

- Record creation
- Record modification
- Status transition
- Assignment
- Authorization change
- Session revocation
- Review
- Adoption
- Rejection
- Supersession
- Record linking
- Record unlinking
- Archival action

Audit records are not ordinary user-editable application content.

Audit history should remain append-oriented and protected from routine browser mutation.

---

## Firestore

Cloud Firestore is the current authoritative database.

Firebase Security Rules are maintained in:

```text
firestore.rules
```

Trusted server operations use Firebase Admin.

Browser access must remain constrained by Firebase Security Rules and server-side authorization architecture.

The system does not currently use Supabase PostgreSQL as its authoritative database.

Historical Supabase design material should be treated as superseded architecture unless explicitly preserved in an archival technical record.

---

## Repository Structure

The authoritative source tree currently follows the Next.js `src` layout:

```text
KLI-MEMBER-PORTAL/
│
├── .github/
│   └── workflows/
│
├── docs/
│   └── governance/
│
├── public/
│
├── scripts/
│   ├── provision-admins.mjs
│   └── seed-publications.mjs
│
├── src/
│   │
│   ├── __tests__/
│   │
│   ├── app/
│   │   ├── access-denied/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── billing/
│   │   ├── bookmarks/
│   │   ├── briefings/
│   │   ├── certificates/
│   │   ├── courses/
│   │   ├── curriculum/
│   │   ├── dashboard/
│   │   ├── downloads/
│   │   ├── executive/
│   │   ├── publications/
│   │   └── ...
│   │
│   ├── components/
│   │
│   ├── lib/
│   │   ├── auth/
│   │   ├── firebase/
│   │   ├── institutionalContent.ts
│   │   ├── publication-record.ts
│   │   ├── publication-validation.ts
│   │   └── publications.ts
│   │
│   ├── proxy.ts
│   └── types/
│
├── .env.example
├── .firebaserc
├── apphosting.yaml
├── firebase.json
├── firestore.rules
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── next.config.ts
├── tsconfig.json
├── ARCHITECTURE.md
├── DATABASE.md
├── SETUP.md
└── README.md
```

Future institutional-domain implementation is expected to introduce:

```text
src/domain/
```

The domain layer must remain independent from UI and infrastructure dependencies.

---

## Development Setup

### Clone the Repository

```bash
git clone https://github.com/kellylegacyestates/KLI-MEMBER-PORTAL.git
cd KLI-MEMBER-PORTAL
```

### Enable Corepack and Install Dependencies

```bash
corepack enable
pnpm install
```

### Configure the Environment

```bash
cp .env.example .env.local
```

Configure the required Firebase client and trusted server environment values.

Never commit private credentials.

Do not expose server-only Firebase Admin configuration through `NEXT_PUBLIC_*` variables.

### Start the Development Server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

## Available Package Commands

The current repository defines the following principal commands:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm provision:admins
pnpm seed:publications
```

Do not document development commands that are not defined in the repository unless they are intentionally added to `package.json`.

---

## Validation

Before accepting a controlled implementation unit, run the commands actually supported by the repository:

```bash
pnpm lint
pnpm test
pnpm build
```

Any failure must be recorded.

A failed validation step must not be represented as passing.

---

## Production Build

Build the application:

```bash
pnpm build
```

Run the built application locally:

```bash
pnpm start
```

---

## Deployment

The deployment target is Firebase App Hosting.

Deployment configuration is maintained through repository configuration including:

```text
apphosting.yaml
.firebaserc
firebase.json
```

Historical Vercel deployment references are obsolete for the current architecture unless expressly reintroduced through an approved architecture change.

Production deployment should occur only after:

- Linting passes
- Tests pass
- Production build passes
- Security controls are reviewed
- Required environment configuration is verified
- Firebase project targeting is verified
- Deployment configuration is reviewed
- Controlled implementation status permits deployment

---

## Security Principles

The platform follows these controlling security principles:

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

## Privacy and Record Access

Access to private institutional and member records must be based upon authenticated identity and authorized institutional capacity.

Controls include:

- Member-specific access restrictions
- Role-restricted executive functions
- Role-restricted administrative functions
- Server-controlled session verification
- Firebase Security Rules
- Trusted privileged mutations
- Audit recording for sensitive actions

Future Matter and Evidence systems will introduce additional record-level access classifications.

---

## Technical Governance

The principal technical-governance record is:

**KLI-TGR-2026-001 — Kelly Legacy Institute Member Portal: Secure Digital Identity, Access Governance, and Institutional Knowledge Infrastructure**

Location:

```text
docs/governance/KLI-TGR-2026-001.md
```

Related verification and findings records are maintained in the same governance directory.

Technical-governance records must distinguish among:

- Verified implementation
- Planned implementation
- Historical architecture
- Known defects
- Unresolved controls
- Corrective actions
- Conformity determinations

Documentation must not represent planned functionality as implemented functionality.

---

## Governing Documentation

Current project documentation includes:

```text
README.md
ARCHITECTURE.md
DATABASE.md
SETUP.md
docs/governance/
```

These documents should describe the actual implementation.

Historical architecture should be moved or clearly labeled as historical rather than mixed into authoritative current-state documentation.

---

## Documentation Reconciliation

The project previously contained architectural references to:

```text
Supabase
PostgreSQL
Row Level Security
Vercel
React Query
Supabase migrations
Vercel Analytics
Vercel Edge Cache
```

Those references belong to an earlier architecture and are not authoritative for the current Firebase implementation unless separately reintroduced through an approved architecture change.

The current authoritative infrastructure is based on:

```text
Next.js
React
TypeScript
Firebase Authentication
Firebase Admin
Cloud Firestore
Firebase Security Rules
Firebase App Hosting
```

---

## Controlled Development Method

Substantial platform development should proceed through bounded implementation units.

Each controlled build should identify:

```text
Starting commit
Scope
Authorized files
Prohibited changes
Implementation requirements
Tests
Validation
Ending commit
Files created
Files modified
Files deleted
Known defects
Scope deviations
Conformity determination
```

Unrelated changes should not be mixed into controlled implementation units.

---

## Current Institutional Build Program

### Phase 4 — Institutional Platform

#### P4-W01 — Architecture Baseline and Documentation Reconciliation

**Objective:** Align technical governance and repository documentation with the actual Firebase implementation.

Primary work includes:

- README reconciliation
- ARCHITECTURE reconciliation
- DATABASE reconciliation
- SETUP reconciliation
- Route inventory
- Security-boundary inventory
- Data-source inventory
- Historical architecture separation

#### P4-W02 — Institutional Domain Model

**Objective:** Define infrastructure-independent institutional record types.

Primary controlled objects:

```text
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

No persistence or user interface should be introduced until the domain model is reviewed and frozen.

#### P4-W03 — Matter Registry Persistence

**Objective:** Implement trusted Firestore persistence and retrieval for the canonical Matter Registry.

#### P4-W04 — Evidence and Authority Registry

**Objective:** Implement controlled evidence, authority, provenance, authentication, and institutional linkage.

#### P4-W05 — Matter Control Interface

**Objective:** Provide authorized institutional users with controlled matter review and navigation.

#### P4-W06 — LDIE Integration

**Objective:** Connect the Legacy Document Intelligence Engine™ to the institutional domain without permitting machine output to silently mutate authoritative institutional state.

#### P4-W07 — Executive Review

**Objective:** Create authorized executive workflows for machine-finding review, disposition, record integrity, and institutional determination.

#### P4-W08 — Scholar Research Integration

**Objective:** Connect controlled research, authorities, and selected institutional records to educational workflows.

#### P4-W09 — Security Closure

**Objective:** Complete and verify outstanding security and access-governance controls.

#### P4-W10 — Production Verification

**Objective:** Establish production readiness through documented conformity review.

---

## Product Direction

The platform is evolving beyond a conventional member portal.

Its institutional purpose is to create a unified environment in which Kelly Legacy Institute can teach the discipline, maintain the record, conduct research, publish institutional work, administer active matters, preserve evidence, and apply machine-assisted intelligence without surrendering human review or institutional control.

The target operational architecture is:

```text
EDUCATION
    │
    ├── Courses
    ├── Curriculum
    ├── Scholars
    └── Certificates

RESEARCH
    │
    ├── Publications
    ├── Authorities
    ├── Sources
    └── Briefings

RECORD GOVERNANCE
    │
    ├── Matters
    ├── Parties
    ├── Capacities
    ├── Evidence
    ├── Communications
    ├── Deadlines
    ├── Determinations
    ├── Reviews
    └── Remedies

DOCUMENT INTELLIGENCE
    │
    └── LDIE
          │
          ├── Intake
          ├── Extraction
          ├── Retrieval
          ├── Classification
          ├── Integrity Review
          └── Machine Findings

EXECUTIVE GOVERNANCE
    │
    ├── Human Review
    ├── Adoption
    ├── Rejection
    ├── Disposition
    └── Audit
```

---

## Contributing and Change Control

Development should occur on a dedicated branch rather than directly on `main`.

Example:

```bash
git checkout -b feature/descriptive-name
```

Before proposing a merge:

```bash
pnpm lint
pnpm test
pnpm build
```

Commit messages should clearly identify the implementation purpose.

Example:

```bash
git commit -m "feat: add institutional matter domain model"
```

Substantial changes should be submitted through pull-request review where repository permissions and workflow permit.

Contributors must not:

- Commit credentials
- Circumvent access controls
- Weaken fail-closed authorization behavior
- Represent planned features as implemented
- Alter institutional record semantics without approved review
- Allow LDIE output to silently mutate authoritative institutional determinations
- Remove audit history as part of ordinary application behavior
- Introduce unrelated changes into controlled implementation units

---

## Intellectual Property and Licensing

### Proprietary Software

The Kelly Legacy Institute Institutional Platform, including the KLI Member Portal, Legacy Document Intelligence Engine™, institutional domain models, source code, software architecture, documentation, workflows, schemas, institutional taxonomies, record-control structures, educational integration methods, and associated materials, is proprietary intellectual property of Kelly Legacy Institute except where specific third-party components are separately licensed.

**Copyright © 2026 Kelly Legacy Institute. All Rights Reserved.**

No license to the proprietary KLI software or institutional materials is granted by the public availability of this repository, source code, documentation, screenshots, demonstrations, deployments, or related materials.

Unless Kelly Legacy Institute provides express written authorization, no person or entity may copy, reproduce, modify, distribute, sublicense, sell, lease, host, publish, commercialize, create derivative works from, reverse engineer for competitive replication, or represent the proprietary KLI software or institutional materials as their own product.

### Permitted Access

Authorized contributors, contractors, developers, reviewers, and institutional users may access and use repository materials only to the extent necessary for work expressly authorized by Kelly Legacy Institute.

Access to the repository does not transfer ownership of intellectual property.

Contributions submitted to the repository are intended for incorporation into the Kelly Legacy Institute Institutional Platform and do not independently convert the project into open-source software.

### Third-Party Software

This project uses third-party software packages and services that remain governed by their respective licenses, terms, and intellectual-property rights.

Examples may include:

- Next.js
- React
- TypeScript
- Firebase
- Firebase Admin SDK
- Tailwind CSS
- Vitest
- ESLint
- pnpm
- Other dependencies identified in `package.json` and `pnpm-lock.yaml`

Nothing in this proprietary notice alters or restricts rights granted under applicable third-party open-source licenses.

Where third-party license terms require preservation of copyright notices, attribution, license text, or source availability, those requirements must be honored.

### Institutional Content

Unless otherwise identified, Kelly Legacy Institute publications, curricula, research frameworks, internal taxonomies, governance records, course materials, instructional content, templates, and institutional documentation remain the intellectual property of Kelly Legacy Institute or their respective identified rights holders.

Publication-specific licenses, Creative Commons terms, repository licenses, DOI-hosted distribution terms, or other express permissions control where separately stated for a particular publication.

### Names and Marks

The following names and identifiers are used as institutional names, product names, program names, or marks associated with Kelly Legacy Institute:

- Kelly Legacy Institute
- KLI
- Kelly Legacy Institute Institutional Platform
- Legacy Document Intelligence Engine
- Legacy Document Intelligence Engine™
- LDIE
- Fiduciary Scholars

Use of repository access does not grant a trademark, service-mark, branding, endorsement, sponsorship, or affiliation license.

### No Implied License

No license or right is granted by implication, estoppel, public repository visibility, technical access, possession of source code, or any other means except through an express written grant from the applicable rights holder.

### External Contributions

By intentionally submitting source code, documentation, configuration, tests, or other material for incorporation into this repository, a contributor represents that they possess the necessary rights to submit the contribution and grants Kelly Legacy Institute the rights reasonably necessary to use, reproduce, modify, integrate, maintain, distribute, deploy, and otherwise operate that contribution as part of the institutional platform.

A separate contributor agreement may be required for substantial external contributions.

### License Status

This repository is **not released under an open-source license** unless and until Kelly Legacy Institute expressly adopts and publishes such a license.

Absent a separate express license:

> **ALL RIGHTS RESERVED.**

---

## Repository Ownership

This repository is maintained for Kelly Legacy Institute.

The software, institutional architecture, proprietary documentation, and KLI-created materials contained in the repository remain subject to the intellectual-property and licensing provisions stated above.

Public repository visibility, where applicable, should not be interpreted as abandonment of copyright or dedication of proprietary materials to the public domain.

---

## Institutional Contact

**Kelly Legacy Institute**

Website:  
https://www.kellylegacyestates.com

Platform:  
https://access.kellylegacyestates.com

Repository:  
https://github.com/kellylegacyestates/KLI-MEMBER-PORTAL

---

**Last Updated:** September 15, 2026  
**Status:** Active Development  
**Architecture:** Firebase / Firestore Institutional Platform  
**Current Controlled Program:** Phase 4 — Institutional Platform  
**License Status:** Proprietary — All Rights Reserved
