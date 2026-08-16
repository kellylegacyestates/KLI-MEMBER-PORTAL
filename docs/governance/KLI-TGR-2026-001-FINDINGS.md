# KLI-TGR-2026-001 Implementation Findings

## Assessment basis

These findings reflect repository `4008e3ff0f2018bd6ced9bffb3861530bb7f9f67`, inspected August 16, 2026. They do not claim access to Firebase, Google Cloud, DNS, or production runtime evidence.

## Critical

No critical defect was established from repository evidence. This is not a production security certification.

## High

### H-01 — Registration does not deliver email verification

- **Observation:** Trusted session creation requires a verified Firebase email, but registration does not send or resend a verification email.
- **Evidence:** `src/lib/firebase/registerUser.ts` creates the account and profile; repository search found no `sendEmailVerification` call. `src/app/api/auth/session/route.ts` rejects unverified email tokens.
- **Risk:** Newly registered members can be left unable to establish a portal session without out-of-band intervention.
- **Recommended remediation:** Add a controlled verification-email and resend flow, test authorized-domain behavior, and document support recovery.
- **Related white-paper section:** 6.2 Email verification.

### H-02 — Operational monitoring and alerting are not established

- **Observation:** The code emits selected console diagnostics, but no monitoring provider, alert rules, escalation path, or service objective is established.
- **Evidence:** `src/lib/auth/loginDiagnostics.ts`, `src/app/api/auth/session/route.ts`, and administrative routes use console logging; no monitoring configuration is committed.
- **Risk:** Authentication failures, administrative failures, abuse, and service degradation may not produce timely institutional response.
- **Recommended remediation:** Approve monitored signals, alert thresholds, on-call ownership, escalation, and evidence retention; verify the production integration.
- **Related white-paper section:** 12.2 Monitoring and alerting.

### H-03 — Firestore backup, recovery, and retention controls are unverified

- **Observation:** No Firestore backup schedule, recovery procedure, recovery exercise, or retention policy is established in the repository.
- **Evidence:** Repository configuration contains no applicable backup or TTL control; `DATABASE.md` and `README.md` backup statements refer to legacy Supabase plans.
- **Risk:** Member profiles, authorization history, publications, and audit records may not meet institutional availability or records obligations.
- **Recommended remediation:** Define RPO/RTO, configure and independently verify Firestore backups, test restoration, and approve retention and deletion schedules.
- **Related white-paper section:** 12.3 Backup and recovery; 12.4 Data retention.

### H-04 — CI omits existing tests and Firestore Rules validation

- **Observation:** CI installs, builds, and lints but does not run the Vitest suite or rules tests.
- **Evidence:** `.github/workflows/ci.yml` has no test step; `package.json` defines `pnpm test`; no Firestore emulator rules tests are present.
- **Risk:** Authentication, authorization, session, and rules regressions may merge without automated behavioral validation.
- **Recommended remediation:** Add the existing test command to required CI and add emulator-based tests for ownership, privilege fields, public reads, and default deny.
- **Related white-paper section:** 10.1 Continuous integration; 9.3 Validation depth.

### H-05 — Audit presentation exceeds implemented audit coverage

- **Observation:** The admin audit page describes comprehensive authentication, access, administrative, and security-alert records, but it is static and the audit writer supports only three action types.
- **Evidence:** `src/app/admin/audit/page.tsx` renders static cards; `src/lib/auth/audit.ts` defines session-revocation and authorization-update events only.
- **Risk:** Administrators may rely on an audit capability that does not record or display the represented events.
- **Recommended remediation:** Correct user-facing claims, define required audit events, implement controlled audit review, and establish retention and alerting.
- **Related white-paper section:** 12.1 Application audit events.

## Medium

### M-01 — Firestore profile create validation is incomplete

- **Observation:** Create rules enforce UID and safe initial authorization values but do not restrict all allowed keys, field types, lengths, or timestamp semantics.
- **Evidence:** `firestore.rules` `match /users/{uid}` create clause checks selected values without `keys().hasOnly` or type/size validation.
- **Risk:** A registering client can store unexpected or oversized non-privileged fields, reducing schema integrity and potentially increasing cost.
- **Recommended remediation:** Define the approved profile schema and add strict create/update validation with emulator tests.
- **Related white-paper section:** 9.3 Validation depth.

### M-02 — Root architecture documentation conflicts with implementation

- **Observation:** Root documentation mixes the implemented Firebase/App Hosting architecture with historical Next.js 15, Supabase, PostgreSQL RLS, Stripe, and Vercel assertions and non-existent routes/scripts.
- **Evidence:** `ARCHITECTURE.md`, `DATABASE.md`, `SETUP.md`, and sections of `README.md` conflict with `package.json`, `src/`, Firebase configuration, and `.github/workflows/ci.yml`.
- **Risk:** Operators and reviewers can execute incorrect procedures or treat proposed controls as deployed facts.
- **Recommended remediation:** Reconcile legacy documents in a separately reviewed documentation change, clearly preserving historical proposals where required.
- **Related white-paper section:** 3 Status and evidence model; 5.2 Application structure.

### M-03 — Environment separation and promotion controls are undocumented

- **Observation:** App Hosting and Firebase project files directly identify the production project, with no controlled non-production mapping or promotion procedure.
- **Evidence:** `.firebaserc`, `apphosting.yaml`, and trusted-origin configuration reference production resources; no environment register exists.
- **Risk:** Testing, deployment, and configuration changes may be performed against the wrong environment.
- **Recommended remediation:** Establish environment ownership, project mapping, promotion approval, runtime identity, and rollback documentation.
- **Related white-paper section:** 11.2 Environment separation.

### M-04 — Deployment and detailed branch controls remain partially evidenced

- **Observation:** App Hosting configuration and a main-targeted CI workflow exist, and the GitHub API reports `main` protected, but no repository deployment workflow or detailed protection policy was verified.
- **Evidence:** `firebase.json`, `apphosting.yaml`, `.github/workflows/ci.yml`, and GitHub Branches API observation dated August 16, 2026.
- **Risk:** Reviewers may infer deployment automation, required reviews, or required checks that are not established by the available evidence.
- **Recommended remediation:** Record the App Hosting trigger, environment approvals, required checks, review requirements, bypass authority, and rollback process using external evidence.
- **Related white-paper section:** 10 Delivery and change control.

## Low

### L-01 — Unused client route guard increases maintenance ambiguity

- **Observation:** `ProtectedRoute` contains detailed client authorization behavior but is not imported by application pages; server guards are the actual boundary.
- **Evidence:** `src/components/auth/ProtectedRoute.tsx`; repository usage search found only its declaration.
- **Risk:** Future maintainers may update or rely on the wrong control.
- **Recommended remediation:** Remove the unused component or explicitly retain and test it for a defined UX role while keeping server enforcement authoritative.
- **Related white-paper section:** 8 Protected routes and authorization states.

### L-02 — Access-tier concepts are not implemented

- **Observation:** The current user profile has role and status fields but no membership tier, subscription tier, or generalized entitlement attribute.
- **Evidence:** `src/lib/firebase/userProfile.ts` `UserProfile`; `firestore.rules` `users/{uid}`.
- **Risk:** Documentation or UI may imply fine-grained entitlement control that does not exist.
- **Recommended remediation:** Avoid tier claims; introduce an approved schema only when institutional access policy requires it.
- **Related white-paper section:** 7.1 Authoritative profile record.
