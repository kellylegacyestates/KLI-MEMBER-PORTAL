"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const publicRoutes = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/publications",
  "/research-library",
  "/standing-ledger",
  "/support",
]);

const protectedMemberRoutes = [
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
];

export function isProtectedPath(pathname: string) {
  if (publicRoutes.has(pathname)) {
    return false;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return true;
  }

  return protectedMemberRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const shouldProtect = isProtectedPath(pathname);

  useEffect(() => {
    if (!loading && shouldProtect && !isAuthenticated) {
      const nextPath = pathname && pathname !== "/login" ? pathname : "/dashboard";
      const redirectTarget = `/login?redirect=${encodeURIComponent(nextPath)}`;
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, loading, pathname, router, shouldProtect]);

  if (loading && shouldProtect) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm font-medium text-[#243449]">
        Checking your member access...
      </div>
    );
  }

  if (shouldProtect && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
