import { describe, expect, it } from "vitest";

import type { Capacity } from "@/domain/capacity";
import type { Party } from "@/domain/party";

describe("Party and Capacity domain", () => {
  it("keeps party identity separate from capacity", () => {
    const party: Party = {
      id: "party-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      partyType: "INDIVIDUAL",
      name: "Institutional Actor",
      integrityStatus: "UNREVIEWED",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    const capacity: Capacity = {
      id: "capacity-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      partyId: party.id,
      capacityType: "TRUSTEE",
      integrityStatus: "UNREVIEWED",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(capacity.partyId).toBe(party.id);
    expect(capacity.capacityType).toBe("TRUSTEE");
    expect(party).not.toHaveProperty("capacityType");
  });
});
