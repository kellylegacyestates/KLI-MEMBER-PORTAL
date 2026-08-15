import "server-only";

import { getServerSessionUser, getAuthenticatedMemberProfile } from "@/lib/auth/server";
import { AppShell, type PortalProfileData } from "./AppShell";

type PortalShellProps = {
  children: React.ReactNode;
};

/**
 * Server component wrapper for AppShell.
 *
 * Fetches the authenticated member profile from Firestore using the verified
 * server session and passes it to AppShell for display in the header and
 * navigation. Falls back gracefully when the profile is unavailable.
 *
 * Security note: this component is for display purposes only. Authorization
 * is enforced by the route guard components before this shell renders.
 */
export async function PortalShell({ children }: PortalShellProps) {
  let profileData: PortalProfileData | null = null;

  try {
    const user = await getServerSessionUser();

    if (user) {
      const profile = await getAuthenticatedMemberProfile(user.uid);

      if (profile) {
        profileData = {
          displayName: profile.displayName,
          email: profile.email,
          role: profile.role,
          membershipStatus: profile.membershipStatus,
        };
      }
    }
  } catch (error) {
    // Fail open for display: if profile fetch fails, shell renders without
    // profile data. Security boundaries are enforced by route guards, not here.
    console.warn("Portal shell profile lookup failed.", error);
  }

  return <AppShell profileData={profileData}>{children}</AppShell>;
}
