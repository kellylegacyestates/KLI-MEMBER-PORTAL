"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

// ---------------------------------------------------------------------------
// Route classification
// ---------------------------------------------------------------------------

/**
 * Only these four routes are unconditionally public.
 * All other routes require authentication; admin routes additionally require
 * the "admin" role.
 *
 * NOTE: /publications, /research-library, /standing-ledger, and /support were
 * previously classified as public.  Per Phase 1 requirements they are now
 * protected member routes.  If this materially alters product intent, an
 * administrator should reclassify them here.
 */
const PUBLIC_ROUTES = new Set(["/", "/login", "/register", "/forgot-password"]);

const PROTECTED_MEMBER_ROUTES = [
  "/dashboard",
  "/courses",
  "/curriculum",
  "/briefings",
  "/bookmarks",
  "/notes",
  "/downloads",
  "/certificates",
  "/billing",
  "/profile",
  "/publications",
  "/research-library",
  "/standing-ledger",
  "/support",
];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.has(pathname);
}

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false;
  if (isAdminPath(pathname)) return true;
  return PROTECTED_MEMBER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// ---------------------------------------------------------------------------
// ProtectedRoute component
// ---------------------------------------------------------------------------

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const pathIsAdmin = isAdminPath(pathname);
  const pathIsProtected = isProtectedPath(pathname);

  useEffect(() => {
    if (loading) return;

    if (pathIsProtected && !isAuthenticated) {
      // Unauthenticated — send to login with redirect hint.
      const next = pathname && pathname !== "/login" ? pathname : "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(next)}`);
      return;
    }

    if (pathIsAdmin && isAuthenticated && !isAdmin) {
      // Authenticated but lacks admin role — send to access-denied page.
      router.replace("/dashboard?denied=admin");
    }
  }, [isAuthenticated, isAdmin, loading, pathname, pathIsAdmin, pathIsProtected, router]);

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

  // Authenticated non-admin on an admin path — render access-denied inline while
  // the redirect fires, so there is no flash of the admin content.
  if (pathIsAdmin && isAuthenticated && !isAdmin) {
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
