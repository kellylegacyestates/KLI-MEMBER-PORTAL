import type { Communication } from "@/domain/communication";
import {
  assertMatterChildMatchesScope,
  assertMatterChildScopeImmutable,
  type MatterChildScope,
} from "./matterChildValidation";

export function assertCommunicationMatchesScope(
  record: Communication,
  scope: MatterChildScope,
): void {
  assertMatterChildMatchesScope(record, scope, "Communication");
}

export function assertCommunicationScopeImmutable(
  current: Communication,
  next: Communication,
): void {
  assertMatterChildScopeImmutable(current, next, "Communication");
}
