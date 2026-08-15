import type { AccountStatus, MembershipStatus, UserRole } from "@/lib/firebase/userProfile";

/** Returns true if the given value is a recognised role. */
export function isValidRole(value: unknown): value is UserRole {
  return (
    value === "member" ||
    value === "instructor" ||
    value === "executive" ||
    value === "admin"
  );
}

/** Returns true if the given value is a recognised account status. */
export function isValidAccountStatus(value: unknown): value is AccountStatus {
  return value === "active" || value === "suspended" || value === "revoked";
}

/** Returns true if the given value is a recognised membership status. */
export function isValidMembershipStatus(value: unknown): value is MembershipStatus {
  return (
    value === "pending" ||
    value === "active" ||
    value === "suspended" ||
    value === "expired" ||
    value === "revoked"
  );
}
