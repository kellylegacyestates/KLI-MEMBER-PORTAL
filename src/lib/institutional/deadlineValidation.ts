import type { Deadline } from "@/domain/deadline";
import {
  assertMatterChildMatchesScope,
  assertMatterChildScopeImmutable,
  type MatterChildScope,
} from "./matterChildValidation";

export function assertDeadlineMatchesScope(
  record: Deadline,
  scope: MatterChildScope,
): void {
  assertMatterChildMatchesScope(record, scope, "Deadline");
}

export function assertDeadlineScopeImmutable(
  current: Deadline,
  next: Deadline,
): void {
  assertMatterChildScopeImmutable(current, next, "Deadline");
}
