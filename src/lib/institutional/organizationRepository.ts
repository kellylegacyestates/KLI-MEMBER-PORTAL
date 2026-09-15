import "server-only";

import type { Organization } from "@/domain/organization";
import type { OrganizationId } from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import { organizationDocumentPath } from "./tenantPaths";

function organizationRef(organizationId: OrganizationId) {
  return getFirebaseAdminDb().doc(
    organizationDocumentPath(organizationId),
  );
}

export async function getOrganization(
  organizationId: OrganizationId,
): Promise<Organization | null> {
  const snapshot = await organizationRef(organizationId).get();

  if (!snapshot.exists) {
    return null;
  }

  const organization = snapshot.data() as Organization;

  if (organization.id !== organizationId) {
    throw new Error("Organization document ID mismatch.");
  }

  return organization;
}

export async function createOrganization(
  organization: Organization,
): Promise<void> {
  if (organization.id.trim().length === 0) {
    throw new Error("Organization ID is required.");
  }

  const ref = organizationRef(organization.id);
  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(
      `Organization already exists: ${organization.id}`,
    );
  }

  await ref.create(organization);
}
