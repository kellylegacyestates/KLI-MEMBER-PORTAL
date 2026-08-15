import { describe, it, expect } from "vitest";
import { safeRedirectTarget } from "@/lib/auth/redirect";

describe("safeRedirectTarget", () => {
  it("returns a valid internal path as-is", () => {
    expect(safeRedirectTarget("/dashboard")).toBe("/dashboard");
    expect(safeRedirectTarget("/courses/module-1")).toBe("/courses/module-1");
    expect(safeRedirectTarget("/admin")).toBe("/admin");
  });

  it("returns the fallback for null", () => {
    expect(safeRedirectTarget(null)).toBe("/dashboard");
  });

  it("returns the fallback for undefined", () => {
    expect(safeRedirectTarget(undefined)).toBe("/dashboard");
  });

  it("returns the fallback for empty string", () => {
    expect(safeRedirectTarget("")).toBe("/dashboard");
  });

  it("returns the fallback for an absolute URL", () => {
    expect(safeRedirectTarget("https://evil.com")).toBe("/dashboard");
  });

  it("returns the fallback for a protocol-relative URL", () => {
    expect(safeRedirectTarget("//evil.com")).toBe("/dashboard");
  });

  it("returns the fallback for a backslash bypass", () => {
    expect(safeRedirectTarget("/\\evil.com")).toBe("/dashboard");
  });

  it("returns the fallback for an embedded scheme", () => {
    expect(safeRedirectTarget("/path?url=http://evil.com")).toBe("/dashboard");
  });

  it("accepts a custom fallback", () => {
    expect(safeRedirectTarget(null, "/login")).toBe("/login");
  });
});
