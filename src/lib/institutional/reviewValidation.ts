import type { Review } from "@/domain/review";
import {
  assertMatterChildMatchesScope,
  assertMatterChildScopeImmutable,
  type MatterChildScope,
} from "./matterChildValidation";

export function assertReviewMatchesScope(
  record: Review,
  scope: MatterChildScope,
): void {
  assertMatterChildMatchesScope(record, scope, "Review");
}

export function assertReviewScopeImmutable(
  current: Review,
  next: Review,
): void {
  assertMatterChildScopeImmutable(current, next, "Review");
}
