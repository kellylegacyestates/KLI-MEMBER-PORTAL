import "server-only";

import type { Membership } from "@/domain/membership";
import type { OrganizationId } from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import { membershipDocumentPath } from "./tenantPaths";

function membershipRef(
  organizationId: OrganizationId,
  membershipId: string,
) {
  return getFirebaseAdminDb().doc(
    membershipDocumentPath(
      organizationId,
      membershipId,
    ),
  );
}

export async function getMembership(
  organizationId: OrganizationId,
  membershipId: string,
): Promise<Membership | null> {
  const snapshot = await membershipRef(
    organizationId,
    membershipId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const membership = snapshot.data() as Membership;

  if (membership.organizationId !== organizationId) {
    throw new Error(
      "Membership organization scope mismatch.",
    );
  }

  if (membership.id !== membershipId) {
    throw new Error(
      "Membership document ID mismatch.",
    );
  }

  return membership;
}

export async function createMembership(
  membership: Membership,
): Promise<void> {
  if (membership.id.trim().length === 0) {
    throw new Error("Membership ID is required.");
  }

  if (membership.organizationId.trim().length === 0) {
    throw new Error(
      "Membership organization ID is required.",
    );
  }

  if (membership.userId.trim().length === 0) {
    throw new Error("Membership user ID is required.");
  }

  const ref = membershipRef(
    membership.organizationId,
    membership.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(
      `Membership already exists: ${membership.id}`,
    );
  }

  await ref.create(membership);
}
