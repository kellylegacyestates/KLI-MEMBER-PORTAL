import type { MachineFinding } from "@/domain/machineFinding";

import {
  assertMatterChildMatchesScope,
  assertMatterChildScopeImmutable,
  type MatterChildScope,
} from "./matterChildValidation";

export function assertMachineFindingMatchesScope(
  record: MachineFinding,
  scope: MatterChildScope,
): void {
  assertMatterChildMatchesScope(
    record,
    scope,
    "MachineFinding",
  );
}

export function assertMachineFindingScopeImmutable(
  current: MachineFinding,
  next: MachineFinding,
): void {
  assertMatterChildScopeImmutable(
    current,
    next,
    "MachineFinding",
  );
}
