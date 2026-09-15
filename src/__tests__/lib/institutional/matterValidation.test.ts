import { describe, expect, it } from "vitest";

import type { Matter } from "@/domain/matter";
import {
  assertMatterMatchesScope,
  assertMatterScopeImmutable,
  matterMatchesScope,
} from "@/lib/institutional/matterValidation";

function buildMatter(
  overrides: Partial<Matter> = {},
): Matter {
  return {
    id: "matter-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterNumber: "KLI-2026-001",
    title: "Matter Registry Test",
    matterType: "INTERNAL_GOVERNANCE",
    status: "OPEN",
    integrityStatus: "UNREVIEWED",
    createdAt: "2026-09-15T21:00:00Z",
    updatedAt: "2026-09-15T21:00:00Z",
    provenance: {
      sourceType: "TEST",
      createdBy: "user-001",
      createdAt: "2026-09-15T21:00:00Z",
      creationMethod: "HUMAN",
    },
    ...overrides,
  };
}

describe("matter validation", () => {
  it("accepts exact tenant scope", () => {
    expect(
      matterMatchesScope(buildMatter(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-001",
      }),
    ).toBe(true);
  });

  it("rejects cross-organization scope", () => {
    expect(() =>
      assertMatterMatchesScope(buildMatter(), {
        organizationId: "org-999",
        workspaceId: "workspace-001",
        matterId: "matter-001",
      }),
    ).toThrow("Matter organization scope mismatch.");
  });

  it("rejects cross-workspace scope", () => {
    expect(() =>
      assertMatterMatchesScope(buildMatter(), {
        organizationId: "org-001",
        workspaceId: "workspace-999",
        matterId: "matter-001",
      }),
    ).toThrow("Matter workspace scope mismatch.");
  });

  it("prevents tenant scope mutation", () => {
    const current = buildMatter();
    const next = buildMatter({
      workspaceId: "workspace-999",
    });

    expect(() =>
      assertMatterScopeImmutable(current, next),
    ).toThrow("Matter workspace scope is immutable.");
  });
});
