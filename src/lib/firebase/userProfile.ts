import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
  type FieldValue,
} from "firebase/firestore";
import {
  isValidAccountStatus,
  isValidRole,
} from "@/lib/firebase/userProfileValidators";
export {
  isValidAccountStatus,
  isValidMembershipStatus,
  isValidRole,
} from "@/lib/firebase/userProfileValidators";

// ---------------------------------------------------------------------------
// Role, account-status, and membership-status enumerations
// ---------------------------------------------------------------------------

/**
 * The roles that exist in the system.
 *
 * - "member"      Default role for every new registration.  Access to all
 *                 member routes; no administrative authority.
 * - "instructor"  Future instructional role.  Granted only by an
 *                 administrator directly in Firestore; cannot be self-assigned.
 *                 No dedicated authoring routes are implemented in this phase.
 * - "executive"   Leadership and governance role.  Granted only by an admin.
 *                 Permitted on: all member routes plus executive routes
 *                 (/executive and sub-paths).
 * - "admin"       Full administrative authority.  Same restriction as above.
 *
 * SECURITY NOTE: the client-side registration path ALWAYS hard-codes the role
 * to "member".  Roles may only be elevated by a trusted administrator via the
 * Firebase console or a privileged server-side function — never by the browser.
 */
export type UserRole = "member" | "instructor" | "executive" | "admin";

/**
 * Account status lifecycle:
 *
 * - "active"     The identity is eligible to sign in and be evaluated for
 *               membership or role-based authorization.
 * - "suspended" Temporarily blocked from all protected access.
 * - "revoked"   Permanently blocked from all protected access.
 */
export type AccountStatus = "active" | "suspended" | "revoked";

/**
 * Membership status lifecycle:
 *
 * - "pending"    Newly registered; awaiting any manual or automated approval
 *               step.  Chosen as the safest default so administrators can
 *               control who gains full access without needing to immediately
 *               suspend newly joined accounts.
 * - "active"     Full access granted.
 * - "suspended"  Temporarily blocked; administrator action required.
 * - "expired"    Membership term lapsed; renewal required.
 * - "revoked"    Permanently revoked; no path to self-reinstatement.
 */
export type MembershipStatus = "pending" | "active" | "suspended" | "expired" | "revoked";

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
  accountStatus: AccountStatus;
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
    const accountStatus: AccountStatus = isValidAccountStatus(data.accountStatus)
      ? data.accountStatus
      : "suspended";

    const status = (["pending", "active", "suspended", "expired", "revoked"] as const).includes(
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
      accountStatus,
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
 * Fields a member may update on their own profile.
 * Protected fields (uid, email, role, membershipStatus, createdAt) are
 * intentionally excluded and must never appear here.
 */
export interface UpdateableProfileFields {
  displayName: string;
  institution: string;
  membershipPurpose: string;
}

/**
 * Update the permitted member-editable fields on a profile document.
 * Only displayName, institution, membershipPurpose, and updatedAt are written.
 * All protected fields are excluded at the call-site, not just in Firestore rules.
 */
export async function updateUserProfile(
  db: Firestore,
  uid: string,
  fields: UpdateableProfileFields
): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  await updateDoc(ref, {
    displayName: fields.displayName,
    institution: fields.institution,
    membershipPurpose: fields.membershipPurpose,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Write a brand-new user profile to Firestore.
 * Role is ALWAYS forced to "member", accountStatus to "active", and
 * membershipStatus to "pending".
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
    // Hard-coded: new identities can authenticate, but member content remains
    // blocked until membershipStatus is approved.
    accountStatus: "active",
    // Hard-coded: pending until an admin approves.
    membershipStatus: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, profileData);
}
