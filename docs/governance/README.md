# Technical Governance

This directory contains controlled technical-governance records for the Kelly Legacy Institute Member Portal.

## Principal reference

[KLI-TGR-2026-001 — Kelly Legacy Institute Member Portal: Secure Digital Identity, Access Governance, and Institutional Knowledge Infrastructure](./KLI-TGR-2026-001.md) is the principal technical-governance reference for the portal. It remains **Draft for Institutional Review** and is not an approved or adopted policy.

Supporting records:

- [Verification register](./KLI-TGR-2026-001-VERIFICATION.md)
- [Implementation findings](./KLI-TGR-2026-001-FINDINGS.md)

## Status vocabulary

| Classification | Meaning |
| --- | --- |
| Governing principle | An institutional requirement or decision criterion. It does not, by itself, prove implementation. |
| Verified current implementation | Repository or authoritative API evidence demonstrates that the control exists at the recorded verification point. |
| Implementation in development | Relevant implementation exists, but it is incomplete, unverified in operation, or missing a material control. |
| Proposed control | A documented control that has not been implemented. |
| Future control | A deliberately deferred capability outside the present implementation phase. |

## Evidence rule

> Repository documentation must not represent proposed architecture as deployed operating fact.

Repository evidence establishes what is implemented in source control. Firebase Console, Google Cloud, GitHub settings, and production-runtime assertions require external evidence when they cannot be established from the repository or an authoritative API.
