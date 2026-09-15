import "server-only";

import type { Review } from "@/domain/review";
import type {
  MatterId,
  OrganizationId,
  ReviewId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertReviewMatchesScope,
  assertReviewScopeImmutable,
} from "./reviewValidation";
import { reviewDocumentPath } from "./tenantPaths";

function reviewRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  reviewId: ReviewId,
) {
  return getFirebaseAdminDb().doc(
    reviewDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      reviewId,
    ),
  );
}

export async function getReview(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  reviewId: ReviewId,
): Promise<Review | null> {
  const snapshot = await reviewRef(
    organizationId,
    workspaceId,
    matterId,
    reviewId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as Review;

  assertReviewMatchesScope(record, {
    organizationId,
    workspaceId,
    matterId,
    recordId: reviewId,
  });

  return record;
}

export async function createReview(
  record: Review,
): Promise<void> {
  if (record.id.trim().length === 0) {
    throw new Error("Review ID is required.");
  }

  if (record.organizationId.trim().length === 0) {
    throw new Error("Review organization ID is required.");
  }

  if (record.workspaceId.trim().length === 0) {
    throw new Error("Review workspace ID is required.");
  }

  if (record.matterId.trim().length === 0) {
    throw new Error("Review matter ID is required.");
  }

  const ref = reviewRef(
    record.organizationId,
    record.workspaceId,
    record.matterId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Review already exists: ${record.id}`);
  }

  await ref.create(record);
}

export async function updateReview(
  next: Review,
): Promise<void> {
  const ref = reviewRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Review not found: ${next.id}`);
  }

  const current = snapshot.data() as Review;

  assertReviewMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    recordId: next.id,
  });

  assertReviewScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
