import type { Remedy } from "@/domain/remedy";
import {
  assertMatterChildMatchesScope,
  assertMatterChildScopeImmutable,
  type MatterChildScope,
} from "./matterChildValidation";

export function assertRemedyMatchesScope(
  record: Remedy,
  scope: MatterChildScope,
): void {
  assertMatterChildMatchesScope(record, scope, "Remedy");
}

export function assertRemedyScopeImmutable(
  current: Remedy,
  next: Remedy,
): void {
  assertMatterChildScopeImmutable(current, next, "Remedy");
}
