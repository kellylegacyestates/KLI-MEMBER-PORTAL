import { describe, expect, it } from "vitest";

import {
  assertMatterMatchesScope,
  assertMatterScopeImmutable,
} from "@/lib/institutional/matterValidation";
import { matterDocumentPath } from "@/lib/institutional/tenantPaths";
import type { Matter } from "@/domain/matter";

function matter(
  overrides: Partial<Matter> = {},
): Matter {
  return {
    id: "matter-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterNumber: "KLI-2026-001",
    title: "Matter Repository Test",
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

describe("matter repository contract", () => {
  it("uses organization and workspace scoped document paths", () => {
    expect(
      matterDocumentPath(
        "org-001",
        "workspace-001",
        "matter-001",
      ),
    ).toBe(
      "organizations/org-001/workspaces/workspace-001/matters/matter-001",
    );
  });

  it("rejects stored records outside the requested scope", () => {
    expect(() =>
      assertMatterMatchesScope(matter(), {
        organizationId: "org-999",
        workspaceId: "workspace-001",
        matterId: "matter-001",
      }),
    ).toThrow("Matter organization scope mismatch.");
  });

  it("prevents matter scope migration through update", () => {
    const current = matter();
    const next = matter({
      organizationId: "org-999",
    });

    expect(() =>
      assertMatterScopeImmutable(current, next),
    ).toThrow("Matter organization scope is immutable.");
  });
});
