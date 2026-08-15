import { describe, it, expect } from "vitest";
import {
  isPublicPath,
  isAdminPath,
  isExecutivePath,
  isProtectedPath,
} from "@/lib/auth/routes";

describe("isPublicPath", () => {
  it("returns true for /login", () => expect(isPublicPath("/login")).toBe(true));
  it("returns true for /register", () => expect(isPublicPath("/register")).toBe(true));
  it("returns true for /forgot-password", () => expect(isPublicPath("/forgot-password")).toBe(true));
  it("returns true for /verify-email", () => expect(isPublicPath("/verify-email")).toBe(true));
  it("returns true for /access-denied", () => expect(isPublicPath("/access-denied")).toBe(true));
  it("returns true for /", () => expect(isPublicPath("/")).toBe(true));
  it("returns true for public publication routes", () => {
    expect(isPublicPath("/publications")).toBe(true);
    expect(isPublicPath("/publications/example-record")).toBe(true);
  });
  it("returns false for /dashboard", () => expect(isPublicPath("/dashboard")).toBe(false));
  it("returns false for /admin", () => expect(isPublicPath("/admin")).toBe(false));
});

describe("isAdminPath", () => {
  it("returns true for /admin", () => expect(isAdminPath("/admin")).toBe(true));
  it("returns true for /admin/members", () => expect(isAdminPath("/admin/members")).toBe(true));
  it("returns true for /admin/content", () => expect(isAdminPath("/admin/content")).toBe(true));
  it("returns true for /admin/access", () => expect(isAdminPath("/admin/access")).toBe(true));
  it("returns true for /admin/audit", () => expect(isAdminPath("/admin/audit")).toBe(true));
  it("returns false for /dashboard", () => expect(isAdminPath("/dashboard")).toBe(false));
  it("returns false for /executive", () => expect(isAdminPath("/executive")).toBe(false));
});

describe("isExecutivePath", () => {
  it("returns true for /executive", () => expect(isExecutivePath("/executive")).toBe(true));
  it("returns true for /executive/execution-framework", () =>
    expect(isExecutivePath("/executive/execution-framework")).toBe(true));
  it("returns true for /executive/institutional-governance", () =>
    expect(isExecutivePath("/executive/institutional-governance")).toBe(true));
  it("returns false for /admin", () => expect(isExecutivePath("/admin")).toBe(false));
  it("returns false for /dashboard", () => expect(isExecutivePath("/dashboard")).toBe(false));
});

describe("isProtectedPath", () => {
  it("returns false for public paths", () => {
    expect(isProtectedPath("/login")).toBe(false);
    expect(isProtectedPath("/register")).toBe(false);
    expect(isProtectedPath("/forgot-password")).toBe(false);
    expect(isProtectedPath("/verify-email")).toBe(false);
    expect(isProtectedPath("/access-denied")).toBe(false);
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/publications")).toBe(false);
    expect(isProtectedPath("/publications/example-record")).toBe(false);
  });

  it("returns true for member routes", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/courses")).toBe(true);
    expect(isProtectedPath("/library")).toBe(true);
    expect(isProtectedPath("/account")).toBe(true);
    expect(isProtectedPath("/support")).toBe(true);
  });

  it("returns true for executive routes", () => {
    expect(isProtectedPath("/executive")).toBe(true);
    expect(isProtectedPath("/executive/execution-framework")).toBe(true);
    expect(isProtectedPath("/executive/institutional-governance")).toBe(true);
  });

  it("returns true for admin routes", () => {
    expect(isProtectedPath("/admin")).toBe(true);
    expect(isProtectedPath("/admin/members")).toBe(true);
    expect(isProtectedPath("/admin/content")).toBe(true);
    expect(isProtectedPath("/admin/access")).toBe(true);
    expect(isProtectedPath("/admin/audit")).toBe(true);
  });

  it("returns true for nested member routes", () => {
    expect(isProtectedPath("/dashboard/settings")).toBe(true);
    expect(isProtectedPath("/courses/module-1")).toBe(true);
  });
});
