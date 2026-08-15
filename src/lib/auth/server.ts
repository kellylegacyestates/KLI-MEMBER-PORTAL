import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { DocumentData, Timestamp } from "firebase-admin/firestore";
import type {
  MembershipStatus,
  ResolvedUserProfile,
  UserRole,
} from "@/lib/firebase/userProfile";
import { getSessionCookieName } from "@/lib/auth/cookies";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";

export type AuthenticatedServerUser = {
  claims: DecodedIdToken;
  uid: string;
};

export type MemberAuthorizationResult =
  | { kind: "unauthenticated" }
  | { kind: "missing-profile"; user: AuthenticatedServerUser }
  | {
      kind: "inactive-membership";
      user: AuthenticatedServerUser;
      profile: ResolvedUserProfile;
    }
  | {
      kind: "authorized";
      user: AuthenticatedServerUser;
      profile: ResolvedUserProfile;
    };

export type AdminAuthorizationResult =
  | Exclude<MemberAuthorizationResult, { kind: "authorized" }>
  | {
      kind: "forbidden";
      user: AuthenticatedServerUser;
      profile: ResolvedUserProfile;
    }
  | {
      kind: "authorized";
      user: AuthenticatedServerUser;
      profile: ResolvedUserProfile;
    };

function isValidRole(value: unknown): value is UserRole {
  return value === "member" || value === "instructor" || value === "admin";
}

function isValidMembershipStatus(value: unknown): value is MembershipStatus {
  return value === "pending" || value === "active" || value === "suspended";
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value) {
    return (value as Timestamp).toDate();
  }

  return null;
}

function normalizeUserProfile(uid: string, data: DocumentData | undefined): ResolvedUserProfile | null {
  if (!data) {
    return null;
  }

  const role = isValidRole(data.role) ? data.role : "member";
  const membershipStatus = isValidMembershipStatus(data.membershipStatus)
    ? data.membershipStatus
    : "pending";

  return {
    uid,
    email: typeof data.email === "string" ? data.email : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    institution: typeof data.institution === "string" ? data.institution : "",
    membershipPurpose:
      typeof data.membershipPurpose === "string" ? data.membershipPurpose : "",
    role,
    membershipStatus,
    createdAt: asDate(data.createdAt),
    updatedAt: asDate(data.updatedAt),
  };
}

const readSessionClaims = cache(async (): Promise<DecodedIdToken | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getSessionCookieName())?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    return await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
});

export const verifySessionCookie = readSessionClaims;

export const getServerSessionUser = cache(async (): Promise<AuthenticatedServerUser | null> => {
  const claims = await readSessionClaims();

  if (!claims) {
    return null;
  }

  return {
    claims,
    uid: claims.uid,
  };
});

export const getAuthenticatedMemberProfile = cache(
  async (uid: string): Promise<ResolvedUserProfile | null> => {
    try {
      const snapshot = await getFirebaseAdminDb().collection("users").doc(uid).get();
      return normalizeUserProfile(uid, snapshot.data());
    } catch {
      return null;
    }
  }
);

export const requireActiveMember = cache(
  async (): Promise<MemberAuthorizationResult> => {
    const user = await getServerSessionUser();

    if (!user) {
      return { kind: "unauthenticated" };
    }

    const profile = await getAuthenticatedMemberProfile(user.uid);

    if (!profile) {
      return { kind: "missing-profile", user };
    }

    if (profile.membershipStatus !== "active") {
      return { kind: "inactive-membership", user, profile };
    }

    return { kind: "authorized", user, profile };
  }
);

export const requireAdmin = cache(async (): Promise<AdminAuthorizationResult> => {
  const memberAccess = await requireActiveMember();

  if (memberAccess.kind !== "authorized") {
    return memberAccess;
  }

  if (memberAccess.profile.role !== "admin") {
    return {
      kind: "forbidden",
      user: memberAccess.user,
      profile: memberAccess.profile,
    };
  }

  return memberAccess;
});
