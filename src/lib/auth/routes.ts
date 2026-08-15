const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/access-denied",
]);

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
  "/account",
  "/library",
  "/publications",
  "/research-library",
  "/standing-ledger",
  "/support",
] as const;

const PROTECTED_EXECUTIVE_ROUTES = ["/executive"] as const;

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.has(pathname);
}

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isExecutivePath(pathname: string): boolean {
  return PROTECTED_EXECUTIVE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false;
  if (isAdminPath(pathname)) return true;
  if (isExecutivePath(pathname)) return true;
  return PROTECTED_MEMBER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
