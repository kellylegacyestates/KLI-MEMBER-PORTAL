import { describe, expect, it } from "vitest";

import { authorityDocumentPath } from "@/lib/institutional/tenantPaths";
import {
  assertAuthorityMatchesScope,
  assertAuthorityScopeImmutable,
} from "@/lib/institutional/authorityValidation";
import type { Authority } from "@/domain/authority";

function buildAuthority(
  overrides: Partial<Authority> = {},
): Authority {
  return {
    id: "authority-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterId: "matter-001",
    authorityType: "STATUTE",
    title: "Repository Authority",
    verificationStatus: "UNVERIFIED",
    integrityStatus: "UNREVIEWED",
    provenance: {
      sourceType: "TEST",
      createdBy: "user-001",
      createdAt: "2026-09-15T22:00:00Z",
      creationMethod: "HUMAN",
    },
    ...overrides,
  };
}

describe("authority repository contract", () => {
  it("uses the canonical Matter-scoped path", () => {
    expect(
      authorityDocumentPath(
        "org-001",
        "workspace-001",
        "matter-001",
        "authority-001",
      ),
    ).toBe(
      "organizations/org-001/workspaces/workspace-001/matters/matter-001/authorities/authority-001",
    );
  });

  it("rejects scope drift on stored authority", () => {
    expect(() =>
      assertAuthorityMatchesScope(buildAuthority(), {
        organizationId: "org-999",
        workspaceId: "workspace-001",
        matterId: "matter-001",
        authorityId: "authority-001",
      }),
    ).toThrow("Authority organization scope mismatch.");
  });

  it("prevents authority migration on update", () => {
    expect(() =>
      assertAuthorityScopeImmutable(
        buildAuthority(),
        buildAuthority({ workspaceId: "workspace-999" }),
      ),
    ).toThrow("Authority workspace scope is immutable.");
  });
});
