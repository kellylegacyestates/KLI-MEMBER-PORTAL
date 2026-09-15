import { describe, expect, it } from "vitest";

import type { Authority } from "@/domain/authority";
import {
  assertAuthorityMatchesScope,
  assertAuthorityScopeImmutable,
  authorityMatchesScope,
} from "@/lib/institutional/authorityValidation";

function buildAuthority(
  overrides: Partial<Authority> = {},
): Authority {
  return {
    id: "authority-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterId: "matter-001",
    authorityType: "STATUTE",
    title: "Authority Test",
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

describe("authority validation", () => {
  it("accepts exact scope", () => {
    expect(
      authorityMatchesScope(buildAuthority(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-001",
        authorityId: "authority-001",
      }),
    ).toBe(true);
  });

  it("rejects cross-matter scope", () => {
    expect(() =>
      assertAuthorityMatchesScope(buildAuthority(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-999",
        authorityId: "authority-001",
      }),
    ).toThrow("Authority matter scope mismatch.");
  });

  it("prevents authority scope mutation", () => {
    expect(() =>
      assertAuthorityScopeImmutable(
        buildAuthority(),
        buildAuthority({ organizationId: "org-999" }),
      ),
    ).toThrow("Authority organization scope is immutable.");
  });
});
