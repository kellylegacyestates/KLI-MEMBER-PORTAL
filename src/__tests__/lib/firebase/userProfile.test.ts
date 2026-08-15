import { describe, it, expect } from "vitest";
import { isValidAccountStatus, isValidRole } from "@/lib/firebase/userProfile";

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

describe("isValidAccountStatus", () => {
  it("accepts active", () => expect(isValidAccountStatus("active")).toBe(true));
  it("accepts suspended", () => expect(isValidAccountStatus("suspended")).toBe(true));
  it("accepts revoked", () => expect(isValidAccountStatus("revoked")).toBe(true));
  it("rejects pending", () => expect(isValidAccountStatus("pending")).toBe(false));
  it("rejects unknown status", () => expect(isValidAccountStatus("expired")).toBe(false));
});
