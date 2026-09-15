import type { Determination } from "@/domain/determination";
import {
  assertMatterChildMatchesScope,
  assertMatterChildScopeImmutable,
  type MatterChildScope,
} from "./matterChildValidation";

export function assertDeterminationMatchesScope(
  record: Determination,
  scope: MatterChildScope,
): void {
  assertMatterChildMatchesScope(record, scope, "Determination");
}

export function assertDeterminationScopeImmutable(
  current: Determination,
  next: Determination,
): void {
  assertMatterChildScopeImmutable(current, next, "Determination");
}
