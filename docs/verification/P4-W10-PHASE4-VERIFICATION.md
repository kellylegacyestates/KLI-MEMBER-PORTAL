# P4-W10 — Phase 4 Production Verification Matrix

## Purpose

This work unit verifies the implemented Phase 4 institutional architecture without introducing new persistence domains or disposition authority.

## Baseline

Starting commit:

`723b5a96f228bb808e6a96751f963c00466969d2`

## Governing Principle

**THE RECORD CONTROLS THE BUILD. THE BUILD DOES NOT REDEFINE THE RECORD.**

## Verification Matrix

| Control | Expected Result | Evidence |
|---|---|---|
| Organization scope enforcement | Records cannot cross Organization boundaries | Tenant validation and repository tests |
| Workspace scope enforcement | Records cannot cross Workspace boundaries | Tenant validation and repository tests |
| Matter-child scope enforcement | Matter-scoped records remain bound to their Matter | Matter-child validation tests |
| Evidence persistence | Evidence persists only through trusted server repositories | Repository implementation and tests |
| Authority persistence | Authority persists only through trusted server repositories | Repository implementation and tests |
| Communication persistence | Communication remains Matter-scoped | Validation and repository tests |
| Deadline persistence | Deadline remains Matter-scoped | Validation and repository tests |
| Review persistence | Review remains Matter-scoped | Validation and repository tests |
| Remedy persistence | Remedy remains Matter-scoped | Validation and repository tests |
| MachineFinding persistence | LDIE may persist only governed analytical findings | P4-W07/P4-W08 tests |
| LDIE disposition authority | LDIE cannot adopt, reject, supersede, or determine | LDIE boundary tests |
| Executive authorization | Only authorized executive/admin review paths may dispose findings | P4-W09 service tests |
| MachineFinding lifecycle | PROPOSED → UNDER_REVIEW → final disposition only | Transition tests |
| Reviewer identity | Reviewer identity is recorded and cannot be substituted during active review | P4-W09 tests |
| AuditEvent behavior | AuditEvent history is append-only | Repository implementation and tests |
| Browser access | Institutional persistence remains denied to browser writes | Firestore rules |
| Determination separation | MachineFinding disposition does not issue Determination | Service boundary and documentation |
| Matter closure separation | Finding disposition does not close Matter | Service boundary |
| Review exhaustion separation | Finding disposition does not exhaust Review | Service boundary |
| Remedy exhaustion separation | Finding disposition does not exhaust Remedy | Service boundary |

## Phase 4 Institutional State

```text
Organization
  ↓
Workspace
  ↓
Matter
  ├─ Evidence
  ├─ Authority
  ├─ Communication
  ├─ Deadline
  ├─ Review
  ├─ Remedy
  ├─ MachineFinding
  │      ↓
  │   Executive Review
  │      ↓
  │   ADOPTED / REJECTED / SUPERSEDED
  │
  └─ AuditEvent

Then finish the file:

```bash
cat >> docs/verification/P4-W10-PHASE4-VERIFICATION.md <<'EOF'

## Institutional Distinctions Preserved

- received evidence ≠ authenticated evidence
- authenticated evidence ≠ admitted evidence
- extracted citation ≠ verified authority
- MachineFinding ≠ Determination
- adopted MachineFinding ≠ adjudicated Matter
- rejected MachineFinding ≠ closed Matter
- superseded MachineFinding ≠ deleted record
- LDIE proposal ≠ human disposition
- human disposition ≠ institutional determination

## P4-W10 Scope

This work unit verifies and reconciles the implemented Phase 4 architecture.

It does not introduce:

- Determination issuance
- Matter closure workflow
- Review exhaustion workflow
- Remedy exhaustion workflow
- new persistence domains
- automated adjudication
- LDIE self-disposition
- browser write access

## Closure Standard

Phase 4 may be certified complete only if:

1. full test suite passes
2. lint passes
3. production build passes
4. `git diff --check` passes
5. verification matrix is reconciled to current implementation
6. no unauthorized persistence path is introduced
7. documentation matches implemented behavior
8. no out-of-scope files are present
