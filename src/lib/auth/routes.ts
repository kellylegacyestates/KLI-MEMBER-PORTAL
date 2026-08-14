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
] as const;

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
