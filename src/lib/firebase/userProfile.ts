import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Firestore,
  type FieldValue,
} from "firebase/firestore";

// ---------------------------------------------------------------------------
// Role and membership-status enumerations
// ---------------------------------------------------------------------------

/**
 * The three roles that exist in the system.
 *
 * - "member"      Default role for every new registration.  Access to all
 *                 member routes; no administrative authority.
 * - "instructor"  Elevated content-creation role.  Granted only by an
 *                 administrator directly in Firestore; cannot be self-assigned.
 * - "admin"       Full administrative authority.  Same restriction.
 *
 * SECURITY NOTE: the client-side registration path ALWAYS hard-codes the role
 * to "member".  Roles may only be elevated by a trusted administrator via the
 * Firebase console or a privileged server-side function — never by the browser.
 */
export type UserRole = "member" | "instructor" | "admin";

/**
 * Membership status lifecycle:
 *
 * - "pending"    Newly registered; awaiting any manual or automated approval
 *               step.  Chosen as the safest default so administrators can
 *               control who gains full access without needing to immediately
 *               suspend newly joined accounts.
 * - "active"     Full access granted.
 * - "suspended"  Access revoked; user can authenticate but the application
 *               must deny access to protected content.
 */
export type MembershipStatus = "pending" | "active" | "suspended";

// ---------------------------------------------------------------------------
// Profile document shape
// ---------------------------------------------------------------------------

/** Shape stored in Firestore at "users/{uid}". */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  institution: string;
  membershipPurpose: string;
  role: UserRole;
  membershipStatus: MembershipStatus;
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

/** A resolved profile (timestamps are always Date objects after a fetch). */
export interface ResolvedUserProfile extends Omit<UserProfile, "createdAt" | "updatedAt"> {
  createdAt: Date | null;
  updatedAt: Date | null;
}

// ---------------------------------------------------------------------------
// Firestore helpers
// ---------------------------------------------------------------------------

const USERS_COLLECTION = "users";

/** Returns true if the given value is a recognised, non-privileged role. */
export function isValidRole(value: unknown): value is UserRole {
  return value === "member" || value === "instructor" || value === "admin";
}

/**
 * Fetch a user's profile document from Firestore.
 * Returns null when the document does not exist or Firestore is unavailable.
 * This function is intentionally fail-closed: any error returns null rather
 * than a partially trusted object.
 */
export async function fetchUserProfile(
  db: Firestore,
  uid: string
): Promise<ResolvedUserProfile | null> {
  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    if (!data) {
      return null;
    }

    // Validate the role field before trusting it.
    const role: UserRole = isValidRole(data.role) ? data.role : "member";

    const status = (["pending", "active", "suspended"] as const).includes(
      data.membershipStatus
    )
      ? (data.membershipStatus as MembershipStatus)
      : "pending";

    return {
      uid,
      email: typeof data.email === "string" ? data.email : "",
      displayName: typeof data.displayName === "string" ? data.displayName : "",
      institution: typeof data.institution === "string" ? data.institution : "",
      membershipPurpose:
        typeof data.membershipPurpose === "string" ? data.membershipPurpose : "",
      role,
      membershipStatus: status,
      createdAt: data.createdAt?.toDate?.() ?? null,
      updatedAt: data.updatedAt?.toDate?.() ?? null,
    };
  } catch {
    // Fail closed: return null so callers cannot assume any privilege.
    return null;
  }
}

/**
 * Write a brand-new user profile to Firestore.
 * Role is ALWAYS forced to "member" and membershipStatus to "pending".
 * Callers cannot override these values.
 */
export async function createUserProfile(
  db: Firestore,
  params: {
    uid: string;
    email: string;
    displayName: string;
    institution: string;
    membershipPurpose: string;
  }
): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, params.uid);

  const profileData: Omit<UserProfile, "createdAt" | "updatedAt"> & {
    createdAt: FieldValue;
    updatedAt: FieldValue;
  } = {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName,
    institution: params.institution,
    membershipPurpose: params.membershipPurpose,
    // Hard-coded: clients can never self-assign a privileged role.
    role: "member",
    // Hard-coded: pending until an admin approves.
    membershipStatus: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, profileData);
}
