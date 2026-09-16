import type { MachineFinding } from "@/domain/machineFinding";
import type {
  MachineFindingDisposition,
  UserId,
} from "@/domain/shared";

export type FinalMachineFindingDisposition =
  | "ADOPTED"
  | "REJECTED"
  | "SUPERSEDED";

export interface BeginMachineFindingReviewInput {
  current: MachineFinding;
  reviewerId: UserId;
  reviewedAt: string;
}

export interface DisposeMachineFindingInput {
  current: MachineFinding;
  reviewerId: UserId;
  reviewedAt: string;
  disposition: FinalMachineFindingDisposition;
}

function assertReviewer(
  reviewerId: UserId,
  reviewedAt: string,
): void {
  if (reviewerId.trim().length === 0) {
    throw new Error("MachineFinding reviewer ID is required.");
  }

  if (reviewedAt.trim().length === 0) {
    throw new Error("MachineFinding review timestamp is required.");
  }
}

export function beginMachineFindingReview(
  input: BeginMachineFindingReviewInput,
): MachineFinding {
  const { current, reviewerId, reviewedAt } = input;

  assertReviewer(reviewerId, reviewedAt);

  if (current.disposition !== "PROPOSED") {
    throw new Error(
      "Only PROPOSED MachineFinding records may enter review.",
    );
  }

  return {
    ...current,
    disposition: "UNDER_REVIEW",
    reviewedBy: reviewerId,
    reviewedAt,
  };
}

export function disposeMachineFinding(
  input: DisposeMachineFindingInput,
): MachineFinding {
  const {
    current,
    reviewerId,
    reviewedAt,
    disposition,
  } = input;

  assertReviewer(reviewerId, reviewedAt);

  if (current.disposition !== "UNDER_REVIEW") {
    throw new Error(
      "Only UNDER_REVIEW MachineFinding records may be disposed.",
    );
  }

  if (
    disposition !== "ADOPTED" &&
    disposition !== "REJECTED" &&
    disposition !== "SUPERSEDED"
  ) {
    throw new Error(
      "Invalid final MachineFinding disposition.",
    );
  }

  if (
    current.reviewedBy &&
    current.reviewedBy !== reviewerId
  ) {
    throw new Error(
      "MachineFinding reviewer identity cannot change during disposition.",
    );
  }

  return {
    ...current,
    disposition,
    reviewedBy: reviewerId,
    reviewedAt,
  };
}

export function isFinalMachineFindingDisposition(
  disposition: MachineFindingDisposition,
): disposition is FinalMachineFindingDisposition {
  return (
    disposition === "ADOPTED" ||
    disposition === "REJECTED" ||
    disposition === "SUPERSEDED"
  );
}
