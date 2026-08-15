import { describe, it, expect } from "vitest";
import { isValidRole } from "@/lib/firebase/userProfile";

describe("isValidRole", () => {
  it("accepts member", () => expect(isValidRole("member")).toBe(true));
  it("accepts instructor", () => expect(isValidRole("instructor")).toBe(true));
  it("accepts executive", () => expect(isValidRole("executive")).toBe(true));
  it("accepts admin", () => expect(isValidRole("admin")).toBe(true));
  it("rejects unknown role", () => expect(isValidRole("superadmin")).toBe(false));
  it("rejects empty string", () => expect(isValidRole("")).toBe(false));
  it("rejects null", () => expect(isValidRole(null)).toBe(false));
  it("rejects undefined", () => expect(isValidRole(undefined)).toBe(false));
  it("rejects number", () => expect(isValidRole(1)).toBe(false));
});
