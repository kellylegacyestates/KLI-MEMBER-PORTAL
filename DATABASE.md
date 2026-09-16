# Kelly Legacy Institute Institutional Platform

## Database Architecture and Record Model

**Document Class:** Database Architecture
**System:** Kelly Legacy Institute Institutional Platform
**Authoritative Datastore:** Cloud Firestore
**Security Model:** Firebase Security Rules + trusted server-side authorization
**Current Program:** Phase 4 — Institutional Platform
**Status:** Active Database Specification

---

## 1. Purpose

This document defines the current authoritative database architecture for the Kelly Legacy Institute Institutional Platform.

Cloud Firestore is the current system of record for implemented application data.

Historical PostgreSQL and Supabase schemas previously stored in this repository are not part of the current production architecture unless expressly reintroduced through an approved architecture change.

This document distinguishes:

```text
IMPLEMENTED COLLECTIONS
≠
PLANNED COLLECTIONS
```

Planned institutional domain objects must not be represented as deployed collections until implementation, security review, validation, and controlled acceptance are complete.

---

## 2. Governing Data Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

Database structure must preserve institutional distinctions among:

```text
identity
capacity
authority
evidence
procedure
determination
review
remedy
machine finding
audit history
```

Persistence convenience must not collapse concepts that the institutional model treats separately.

---

## 3. Current Authoritative Datastore

The implemented application uses:

```text
Cloud Firestore
```

Trusted server operations use:

```text
Firebase Admin SDK
```

Browser access is governed by:

```text
firestore.rules
```

The database currently follows a deny-by-default posture.

Collections not explicitly permitted by Firebase Security Rules remain inaccessible to browser clients.

---

## 4. Current Implemented Collections

The currently implemented principal Firestore collections are:

```text
users/{uid}
auditEvents/{eventId}
publications/{publicationId}
```

These are the only collections documented here as current authoritative application collections.

Other institutional collections described later in this document are planned architecture unless separately implemented and verified.

---

# CURRENT COLLECTIONS

## 5. `users/{uid}`

The `users` collection stores institutional user-profile and access-governance information.

Canonical path:

```text
users/{uid}
```

The document ID corresponds to the Firebase Authentication UID.

### Current Purpose

The user profile supports:

- institutional identity association
- role
- account status
- membership status
- profile information
- authorization decisions

### Protected Fields

Protected fields include:

```text
uid
email
role
accountStatus
membershipStatus
createdAt
```

These fields must not be modifiable by ordinary browser profile updates.

### Member-Editable Fields

Current Firebase Security Rules permit narrowly scoped member updates to approved profile fields.

The authoritative list remains controlled by `firestore.rules`.

### Current Initial Authorization State

New client-created profiles must use safe initial values including:

```text
role = member
accountStatus = active
membershipStatus = pending
```

This prevents self-assignment of elevated privileges.

### Current Principal Roles

```text
member
executive
admin
```

Role semantics are governed by server authorization logic and institutional documentation.

---

## 6. `auditEvents/{eventId}`

The `auditEvents` collection stores trusted security and institutional audit events.

Canonical path:

```text
auditEvents/{eventId}
```

### Security Posture

Browser access is denied.

```text
allow read, write: if false;
```

Audit events are intended to be created by trusted server-side processes.

### Audit Purpose

Audit records may preserve events including:

- authorization changes
- administrative session revocation
- security-sensitive operations
- protected status transitions
- privileged administrative actions

Audit records must not be treated as ordinary user-editable application content.

### Append-Oriented Principle

The intended audit posture is append-oriented.

Existing audit history should not be silently rewritten or deleted as part of ordinary application behavior.

---

## 7. `publications/{publicationId}`

The `publications` collection is the canonical Kelly Legacy Institute Publications Registry.

Canonical path:

```text
publications/{publicationId}
```

One document represents one institutional publication across versions and distribution channels.

### Document Identity

The Firestore document ID should use the stable institutional publication identifier.

Example:

```text
KLI-RPS-2026-01
```

The record's internal `id` field must equal the Firestore document ID.

Random document IDs should not be used for canonical publication records.

### Publication Identity and Discovery Fields

A canonical publication may contain:

- id
- slug
- title
- subtitle
- series
- publicationType
- status
- publicationDate
- authors
- institution
- abstract
- keywords

### Visibility

Visibility is explicitly controlled.

Current supported values are:

```text
public
private
```

A publication is publicly readable only when public visibility is explicitly established.

Administrators may access private publication records through authorized workflows.

### Versioning

A publication maintains one stable institutional identity.

Version history remains associated with that identity.

Expected version information may include:

- version identifier
- version status
- public eligibility
- filename
- verified file URL
- timestamp
- notes

A new version does not automatically create a new unrelated publication record.

### Identifiers

Publication identifiers may include:

- ORCID
- SSRN identifiers
- Zenodo DOI
- institutional DOI
- ISBN

An identifier does not by itself prove an external URL is verified.

### Distribution

Distribution metadata may track channels such as:

- SSRN
- Zenodo
- institutional website
- journal publication

Distribution status and external identifiers should remain separate from publication identity.

### Rights and Licensing

Publication records may contain:

- copyright information
- license information
- rights statements
- preferred citation

Publication-specific license terms control where expressly stated.

### Administrative Writes

Administrative writes are restricted to authorized active administrators.

Application mutation logic must independently verify trusted administrative authorization.

---

# SECURITY AND ACCESS CONTROL

## 8. Firestore Security Rules

The repository's authoritative browser-access rules are maintained in:

```text
firestore.rules
```

Current implemented rules include explicit handling for:

```text
users
auditEvents
publications
```

All other collections are denied by the catch-all rule.

This means new institutional collections are not browser-accessible merely because they are created.

That is intentional.

---

## 9. Deny-by-Default Model

The current Firestore security architecture follows:

```text
EXPLICIT ACCESS
OR
DENY
```

Unknown collections must remain denied until:

1. the collection is formally defined,
2. authorization requirements are approved,
3. security rules are written,
4. server-side authorization is implemented where required,
5. tests are added,
6. validation passes.

---

## 10. Server Authority

Firebase Security Rules do not replace trusted server authorization.

Privileged application actions should use:

```text
verified server session
+
institutional user profile
+
required account status
+
required membership status where applicable
+
required role
+
resource authorization
```

The Firebase Admin SDK bypasses client Security Rules by design.

Therefore trusted server code carries a heightened obligation to enforce institutional authorization correctly.

---

# PLANNED INSTITUTIONAL DATA MODEL

## 11. Status of Planned Collections

The following data families are planned and are not represented by this document as currently deployed production collections:

```text
organizations
workspaces
memberships
roleAssignments
entitlements

matters
parties
capacities
authorities
evidence
communications
deadlines
determinations
reviews
remedies

machineFindings
```

No Firestore rules, indexes, production records, or browser permissions for these collections should be assumed until separately implemented.

---

## 12. Planned Organization Model

Future multi-tenant architecture will introduce an Organization concept.

Potential canonical collection:

```text
organizations/{organizationId}
```

An Organization may represent:

- Kelly Legacy Institute
- professional practice
- fiduciary office
- research organization
- legal or compliance organization
- enterprise customer

The organization boundary is intended to support tenant isolation and institutional ownership.

---

## 13. Planned Workspace Model

Potential canonical structure:

```text
organizations/{organizationId}/workspaces/{workspaceId}
```

or an equivalent top-level model with explicit `organizationId`.

The final persistence shape must be selected during implementation review.

A Workspace may scope:

- users
- matters
- records
- permissions
- entitlements
- configuration

The domain model must be defined before persistence structure is frozen.

---

## 14. Planned Membership Model

Membership represents a user's relationship to an organization or workspace.

Membership is distinct from global identity.

A single authenticated user may eventually hold different memberships across organizations.

Possible attributes include:

- userId
- organizationId
- workspaceId
- status
- joinedAt
- invitedBy
- role assignments

---

## 15. Planned Role Assignment Model

Future authorization should support scoped role assignments rather than relying exclusively on one global user role.

Potential roles may include:

```text
organization_admin
workspace_admin
executive_reviewer
matter_manager
analyst
scholar
read_only_reviewer
```

These are planned examples only.

They are not current application roles.

Current application roles remain:

```text
member
executive
admin
```

---

## 16. Planned Entitlement Model

Entitlements are intended to remain separate from authorization.

Authorization answers:

```text
IS THIS USER ALLOWED TO PERFORM THIS ACTION?
```

Entitlement answers:

```text
HAS THIS ORGANIZATION OR USER BEEN GRANTED ACCESS TO THIS PRODUCT OR CAPABILITY?
```

Potential entitlements may include:

```text
LDIE_BASIC
LDIE_PRO
MATTER_REGISTRY
RESEARCH_LIBRARY
EXECUTIVE_REVIEW
CERTIFICATION_PORTAL
```

These identifiers are architectural examples until formally adopted.

---

# MATTER DOMAIN

## 17. Planned `Matter`

A Matter is intended to become the canonical institutional container for an administrative, regulatory, research, trust, estate, litigation, or governance matter.

Potential fields include:

- id
- organizationId
- workspaceId
- matterNumber
- title
- description
- matterType
- jurisdiction
- status
- integrityStatus
- openedAt
- closedAt
- createdAt
- updatedAt
- createdBy

### Planned Matter Status

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

Unknown states must fail closed.

---

## 18. Planned `Party`

A Party identifies the actor.

Potential party types may include:

- individual
- agency
- court
- company
- trust
- estate
- organization
- government body

Party identity must remain distinct from capacity.

---

## 19. Planned `Capacity`

Capacity identifies the role in which a party acts.

Examples may include:

- trustee
- beneficiary
- administrator
- regulator
- claimant
- respondent
- counsel
- custodian
- reviewer

Capacity must not be inferred merely from party identity.

---

# AUTHORITY DOMAIN

## 20. Planned `Authority`

Authority records are intended to represent verified or candidate controlling authorities.

Possible fields include:

- id
- organizationId
- workspaceId
- matterId
- authorityType
- jurisdiction
- issuingBody
- citation
- title
- effectiveDate
- status
- delegation
- duty
- procedure
- reviewRights
- remedy
- verificationStatus
- sourceEvidenceIds
- createdAt
- updatedAt

An extracted citation is not automatically verified authority.

---

# EVIDENCE DOMAIN

## 21. Planned `Evidence`

Evidence will be a first-class institutional record.

Possible fields include:

- id
- organizationId
- workspaceId
- matterId
- title
- evidenceType
- source
- receivedAt
- authenticatedAt
- admittedAt
- integrityStatus
- custody information
- storage reference
- checksum
- provenance
- createdAt
- updatedAt

### Planned Evidence Lifecycle

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

---

## 22. Planned Record Integrity Status

```text
UNREVIEWED
VERIFIED
QUALIFIED
DISPUTED
DEFECTIVE
```

Machine analysis may identify possible integrity concerns.

Human institutional review controls final verification where required.

---

# COMMUNICATION DOMAIN

## 23. Planned `Communication`

Communications may represent:

- letters
- notices
- emails
- filings
- requests
- responses
- service records
- internal controlled communications

Possible fields include:

- matterId
- senderPartyId
- senderCapacityId
- recipientPartyIds
- recipientCapacityIds
- subject
- sentAt
- receivedAt
- serviceMethod
- evidenceId
- responseRequired
- responseDeadlineId
- provenance

Attempted transmission does not automatically establish receipt.

---

# DEADLINE DOMAIN

## 24. Planned `Deadline`

A controlled deadline should be supported by authority and a triggering event.

Possible fields include:

- matterId
- deadlineType
- dueAt
- authorityId
- triggeringEventId
- triggeringEvidenceId
- calculationMethod
- status
- satisfiedAt
- satisfyingEvidenceId
- notes

A machine-extracted date is not automatically an institutional deadline.

---

# DETERMINATION DOMAIN

## 25. Planned `Determination`

A Determination is an institutional record.

Possible fields include:

- matterId
- determinationType
- issuingPartyId
- issuingCapacityId
- issueDate
- effectiveDate
- findings
- authorityIds
- evidenceIds
- disposition
- reviewAvailability
- reviewDeadlineId
- sourceEvidenceId
- provenance

Machine findings must not be persisted as adopted determinations without authorized human review.

---

# REVIEW DOMAIN

## 26. Planned `Review`

Planned review states include:

```text
NOT_AVAILABLE
AVAILABLE
PENDING
FILED
DECIDED
EXHAUSTED
```

Potential fields include:

- matterId
- reviewType
- status
- reviewingBody
- filedAt
- decidedAt
- deadlineId
- determinationId
- evidenceIds
- authorityIds

Review exhaustion must not be inferred from missing records alone.

---

# REMEDY DOMAIN

## 27. Planned `Remedy`

Possible remedy attributes include:

- matterId
- remedyType
- authorityIds
- prerequisites
- status
- preservationDate
- invocationDate
- exhaustionDate
- resultingDeterminationId
- evidenceIds
- notes

Machine systems must not independently declare remedies exhausted.

---

# MACHINE FINDINGS

## 28. Planned `MachineFinding`

Machine findings must remain separate from authoritative institutional determinations.

Potential lifecycle:

```text
PROPOSED
UNDER_REVIEW
ADOPTED
REJECTED
SUPERSEDED
```

Possible fields include:

- id
- organizationId
- workspaceId
- matterId
- sourceRunId
- sourceEvidenceIds
- findingType
- findingText
- confidence
- generatedAt
- processorVersion
- disposition
- reviewedBy
- reviewedAt

`ADOPTED` requires an authorized human review action.

---

# PROVENANCE

## 29. Provenance Model

Governed records should preserve provenance sufficient to establish origin.

Potential provenance attributes include:

- sourceType
- sourceIdentifier
- createdBy
- createdAt
- creationMethod
- sourceEvidenceIds
- machineRunId

Planned creation methods include:

```text
HUMAN
IMPORT
SYSTEM
LDIE_PROPOSAL
```

`LDIE_PROPOSAL` does not confer institutional authority.

---

# DOCUMENT STORAGE

## 30. Binary File Storage

Firestore should not be used as the primary binary document store.

The intended separation is:

```text
Firestore
→ structured metadata and institutional records

Object Storage
→ document binaries

Search / Index Infrastructure
→ retrieval indexes

Audit Store
→ protected audit history
```

Document binaries should eventually use appropriate managed object storage.

Storage architecture must preserve linkage between the binary object and its authoritative evidence metadata.

---

# INDEXING

## 31. Firestore Indexes

Indexes should be introduced only in response to implemented query requirements.

Index definitions must correspond to actual application queries.

Indexes should not be created merely because future architecture anticipates a collection.

---

# MIGRATIONS AND SCHEMA EVOLUTION

## 32. Firestore Schema Evolution

Firestore does not use SQL migrations in the same manner as PostgreSQL.

Controlled schema evolution should account for:

- existing records
- compatibility
- version changes
- backfill
- validation
- rollback strategy
- auditability

Application code must not assume all existing records automatically contain newly introduced fields.

---

## 33. Data Backfill

Any future backfill should:

1. identify the exact target population,
2. preserve existing data,
3. use deterministic transformation rules,
4. support dry-run where feasible,
5. report counts,
6. record failures,
7. verify post-write state.

Silent destructive backfills are prohibited.

---

# TESTING

## 34. Database Validation

Database-related changes should include appropriate tests for:

- authorization
- validators
- data-access functions
- status transitions
- identifier invariants
- required fields
- fail-closed behavior
- publication versioning
- tenant isolation when implemented

---

## 35. Firebase Security Rule Validation

New browser-accessible collections must not be deployed without Security Rule review.

Security requirements should verify:

```text
who may read
who may create
who may update
who may delete
which fields may change
which fields are immutable
which tenant boundary applies
```

Default denial remains the fallback.

---

# HISTORICAL DATABASE ARCHITECTURE

## 36. Superseded PostgreSQL / Supabase Model

Earlier versions of repository documentation described:

- Supabase Auth
- PostgreSQL
- public.members
- courses
- lessons
- member_progress
- SQL migrations
- Row Level Security
- service-role keys
- Supabase Storage

Those structures are historical planning artifacts.

They are not the current authoritative application database.

Historical material may be preserved in repository history or archival documentation for provenance, but it must not be used as active development instruction.

---

# CURRENT DATABASE STATUS

## 37. Implemented vs Planned Summary

### Implemented

```text
users
auditEvents
publications
```

### Planned

```text
organizations
workspaces
memberships
roleAssignments
entitlements

matters
parties
capacities
authorities
evidence
communications
deadlines
determinations
reviews
remedies
machineFindings
```

This distinction must remain explicit until implementation evidence supports promotion of a planned collection to implemented status.

---

## 38. Governing Files

Current database authority is distributed across:

```text
DATABASE.md
ARCHITECTURE.md
firestore.rules
src/lib/firebase/
src/lib/auth/
src/lib/publications.ts
src/lib/publication-record.ts
src/lib/publication-validation.ts
docs/governance/
```

Where documentation conflicts with implementation, the conflict must be treated as a controlled defect and reconciled.

---

## 39. Change Control

Material database changes require controlled review where they affect:

- identity
- authorization
- tenant boundaries
- protected fields
- evidentiary status
- authority verification
- matter lifecycle
- determinations
- review posture
- remedies
- machine finding disposition
- audit history
- retention
- deletion

No database schema should redefine institutional semantics merely for implementation convenience.

---

## 40. Governing Principle

> **THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

---

## P4-W03 — Multi-Tenant / Workspace Foundation

### Implemented Tenant Persistence

Trusted server-side persistence now uses:

```text
organizations/{organizationId}
organizations/{organizationId}/workspaces/{workspaceId}
organizations/{organizationId}/memberships/{membershipId}
```

The implemented hierarchy is:

```text
Organization
    ↓
Workspace
    ↓
future tenant-scoped institutional records
```

### Access Boundary

Browser reads and writes to organizations, workspaces, and memberships remain explicitly denied by Firebase Security Rules.

Persistence is currently available only through trusted Firebase Admin server repositories.

Tenant authorization fails closed unless membership establishes:

- the correct user
- the correct organization
- the correct workspace where required
- ACTIVE membership status

The architecture preserves:

```text
Identity ≠ Membership
Membership ≠ Entitlement
Organization Membership ≠ Automatic Workspace Access
```

### Not Yet Implemented

P4-W03 does not implement:

```text
Matter persistence
Evidence persistence
Authority persistence
browser tenant access
tenant administration UI
LDIE persistence
```

---

## P4-W04 — Matter Registry Persistence

### Implemented Matter Persistence

Trusted server-side Matter persistence now uses:

```text
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}
```

The hierarchy is:

```text
Organization
    ↓
Workspace
    ↓
Matter
```

### Scope Integrity

A persisted Matter must satisfy all three path invariants:

- Matter `organizationId` equals the path organization ID
- Matter `workspaceId` equals the path workspace ID
- Matter `id` equals the path matter ID

These scope identifiers are immutable after creation.

### Repository Boundary

Server-side Matter persistence supports:

```text
create
get
update
```

Creation refuses to overwrite an existing Matter.

Reads validate the stored record against the requested tenant path.

Updates reject organization, workspace, or Matter-ID migration.

### Access Boundary

Browser reads and writes to Matter records remain explicitly denied by Firebase Security Rules.

Matter persistence is available only through trusted Firebase Admin server code.

### Not Yet Implemented

P4-W04 does not implement:

```text
Evidence persistence
Authority persistence
Communication persistence
Deadline persistence
Determination persistence
Review persistence
Remedy persistence
browser Matter access
Matter management UI
LDIE Matter integration
```

---

## P4-W05 — Evidence & Authority Registry Persistence

### Implemented Evidence Persistence

Trusted server-side Evidence persistence uses:

```text
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/evidence/{evidenceId}
```

### Implemented Authority Persistence

Trusted server-side Authority persistence uses:

```text
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/authorities/{authorityId}
```

### Scope Integrity

Evidence and Authority records must match their full tenant and Matter path.

The following identifiers are immutable after creation:

- organization ID
- workspace ID
- Matter ID
- record ID

### Evidence State Integrity

Evidence lifecycle status is distinct from institutional record integrity.

```text
IDENTIFIED ≠ RECEIVED
RECEIVED ≠ AUTHENTICATED
AUTHENTICATED ≠ ADMITTED
EvidenceStatus ≠ RecordIntegrityStatus
```

### Authority Verification Integrity

Authority verification status is distinct from institutional record integrity.

```text
UNVERIFIED ≠ VERIFIED
CANDIDATE ≠ VERIFIED
QUALIFIED ≠ VERIFIED
DISPUTED ≠ VERIFIED
AuthorityVerificationStatus ≠ RecordIntegrityStatus
```

### Repository Boundary

Trusted server repositories support:

```text
Evidence: create / get / update
Authority: create / get / update
```

Creation refuses to overwrite existing records.

Reads validate stored scope against the requested path.

Updates reject tenant, Matter, or record-ID migration.

### Access Boundary

Browser reads and writes remain explicitly denied for Evidence and Authority records.

Persistence is available only through trusted Firebase Admin server code.

### Not Yet Implemented

```text
Communication persistence
Deadline persistence
Determination persistence
Review persistence
Remedy persistence
MachineFinding persistence
browser Evidence access
browser Authority access
Evidence management UI
Authority management UI
LDIE persistence integration
```

---

## P4-W06 — Institutional Record Chain Persistence

### Implemented Matter-Scoped Persistence

Trusted server-side persistence now includes:

```text
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/communications/{communicationId}
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/deadlines/{deadlineId}
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/determinations/{determinationId}
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/reviews/{reviewId}
organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/remedies/{remedyId}
```

### Scope Integrity

Every record must match its full Organization → Workspace → Matter path.

The following identifiers are immutable after creation:

- organization ID
- workspace ID
- Matter ID
- record ID

### Record Distinctions

The institutional record model preserves separate procedural states:

```text
Communication sent/received ≠ Evidence authenticated
Deadline satisfied ≠ Matter closed
Determination issued ≠ Review exhausted
Review decided ≠ Remedy exhausted
Remedy available ≠ Remedy invoked
Remedy resolved ≠ Remedy exhausted
```

### Repository Boundary

Trusted server repositories support create / get / update for:

- Communication
- Deadline
- Determination
- Review
- Remedy

Creation refuses to overwrite existing records.

Reads validate stored scope against the requested Matter path.

Updates reject Organization, Workspace, Matter, or record-ID migration.

### Access Boundary

Browser reads and writes remain explicitly denied for all five record collections.

Persistence is available only through trusted Firebase Admin server code.

### Not Yet Implemented

```text
MachineFinding persistence
AuditEvent persistence
browser institutional-record access
record-management UI
LDIE runtime integration
executive determination workflow
```

---

## P4-W07 — MachineFinding & AuditEvent Persistence

### MachineFinding Persistence

Trusted server-side MachineFinding persistence uses:

`organizations/{organizationId}/workspaces/{workspaceId}/matters/{matterId}/machineFindings/{machineFindingId}`

MachineFinding is Matter-scoped.

Its Organization, Workspace, Matter, and record identifiers are immutable after creation.

MachineFinding persistence supports create, get, and update.

**MachineFinding ≠ Determination.**

Persisting or updating a MachineFinding does not establish an institutional determination.

### AuditEvent Persistence

Workspace-scoped AuditEvent persistence uses:

`organizations/{organizationId}/workspaces/{workspaceId}/auditEvents/{auditEventId}`

The current persistence boundary requires both `organizationId` and `workspaceId`.

AuditEvent persistence supports append and get.

AuditEvent does not support update or delete operations through the institutional repository.

**AuditEvent = append-only institutional history.**

**AuditEvent ≠ mutable business state.**

### Browser Access

Browser reads and writes remain explicitly denied for `machineFindings` and `auditEvents`.

Trusted Firebase Admin server code controls persistence.

### Current Boundary

Implemented:

- Matter-scoped MachineFinding persistence
- MachineFinding scope validation
- MachineFinding controlled updates
- workspace-scoped AuditEvent persistence
- append-only AuditEvent repository behavior
- AuditEvent scope validation
- explicit browser denial

Not implemented in this work unit:

- LDIE execution
- automatic finding adoption
- automatic determinations
- executive review workflow
- browser MachineFinding access
- browser AuditEvent access
- audit UI
- system-global AuditEvent persistence

### Governing Principle

**THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

---

## P4-W08 — LDIE Integration Boundary

The trusted LDIE persistence service coordinates only two institutional writes:

1. creation of a PROPOSED MachineFinding
2. append of a matching LDIE AuditEvent

The MachineFinding and AuditEvent must share the same Organization and Workspace scope, and the AuditEvent must reference the MachineFinding ID.

The LDIE service does not write Determination, Review, Remedy, or Matter-disposition state.

**THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**
