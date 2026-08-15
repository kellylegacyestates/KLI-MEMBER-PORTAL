import { describe, expect, it } from "vitest";
import {
  getContextualNavigation,
  getNavigationLabel,
  isNavigationItemActive,
} from "@/components/layout/navigation";

describe("portal navigation", () => {
  it("matches exact overview routes without activating nested routes", () => {
    expect(
      isNavigationItemActive("/admin/members", {
        label: "Admin Overview",
        href: "/admin",
        exact: true,
      })
    ).toBe(false);
  });

  it("uses the most specific label for nested destinations", () => {
    expect(getNavigationLabel("/admin/publications/record-1")).toBe("Publications");
    expect(getNavigationLabel("/executive/execution-framework")).toBe("Execution Framework");
  });

  it("orders primary member destinations for continuous browsing", () => {
    expect(getContextualNavigation("/research-library")).toEqual({
      overview: { label: "Dashboard", href: "/dashboard" },
      previous: { label: "Curriculum", href: "/curriculum" },
      next: { label: "Publications", href: "/publications" },
    });
  });

  it("keeps role-specific journeys within their authorized sections", () => {
    expect(getContextualNavigation("/admin/access")).toEqual({
      overview: { label: "Admin Overview", href: "/admin" },
      previous: { label: "Members", href: "/admin/members" },
      next: { label: "Content", href: "/admin/content" },
    });
  });

  it("does not add contextual controls to unknown or nested routes", () => {
    expect(getContextualNavigation("/dashboard")).toBeNull();
    expect(getContextualNavigation("/admin/publications/record-1")).toBeNull();
  });
});
