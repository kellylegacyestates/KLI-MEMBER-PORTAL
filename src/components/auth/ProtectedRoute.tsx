"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { isAdminPath, isProtectedPath } from "@/lib/auth/routes";

// ---------------------------------------------------------------------------
// ProtectedRoute component
// ---------------------------------------------------------------------------

/**
 * UX-only client guard. Trusted authorization now happens on the server before
 * protected pages render or protected route handlers run.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading, profile, membershipStatus } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const pathIsAdmin = isAdminPath(pathname);
  const pathIsProtected = isProtectedPath(pathname);
  const profileIsValid = Boolean(profile);
  const hasActiveMembership = membershipStatus === "active";
  const canAccessMemberRoutes = isAuthenticated && profileIsValid && hasActiveMembership;
  const canAccessAdminRoutes = canAccessMemberRoutes && isAdmin;

  useEffect(() => {
    if (loading) return;

    if (pathIsProtected && !isAuthenticated) {
      // Unauthenticated — send to login.
      const next = pathname && pathname !== "/login" ? pathname : "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(next)}`);
      return;
    }
  }, [isAuthenticated, loading, pathIsProtected, pathname, router]);

  // Show a loading indicator while auth + profile resolve for protected paths.
  if (loading && pathIsProtected) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm font-medium text-[#243449]">
        Checking your member access...
      </div>
    );
  }

  // Unauthenticated user on a protected path — render nothing while redirect fires.
  if (pathIsProtected && !isAuthenticated) {
    return null;
  }

  // Authenticated user without a resolvable profile — deny protected access.
  if (pathIsProtected && isAuthenticated && !profileIsValid) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-[#001f3f]">Access denied</p>
        <p className="max-w-xs text-sm text-[#243449]">
          Your member profile could not be verified. Please contact support for assistance.
        </p>
      </div>
    );
  }

  // Authenticated user whose membership is not active — deny member/admin access.
  if (pathIsProtected && isAuthenticated && !hasActiveMembership) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-[#001f3f]">Membership access pending</p>
        <p className="max-w-xs text-sm text-[#243449]">
          Your account exists, but member access is unavailable until your membership is approved.
        </p>
      </div>
    );
  }

  // Authenticated member on an admin path without admin role — deny access.
  if (pathIsAdmin && isAuthenticated && !canAccessAdminRoutes) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-[#001f3f]">Access denied</p>
        <p className="max-w-xs text-sm text-[#243449]">
          Your account does not have administrator access to this area.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
