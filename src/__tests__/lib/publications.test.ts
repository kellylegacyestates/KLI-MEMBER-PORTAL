import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialPublication } from "@/lib/publication-record";

vi.mock("server-only", () => ({}));

const get = vi.fn();
const limit = vi.fn(() => ({ get }));
const secondWhere = vi.fn(() => ({ limit }));
const firstWhere = vi.fn(() => ({ where: secondWhere }));
const collection = vi.fn(() => ({ where: firstWhere }));

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminDb: () => ({ collection }),
}));

describe("publication data access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("looks up a public record by slug", async () => {
    get.mockResolvedValue({
      docs: [{ id: initialPublication.id, data: () => initialPublication }],
    });
    const { getPublicationBySlug } = await import("@/lib/publications");

    const publication = await getPublicationBySlug(initialPublication.slug);

    expect(firstWhere).toHaveBeenCalledWith("slug", "==", initialPublication.slug);
    expect(secondWhere).toHaveBeenCalledWith("visibility", "==", "public");
    expect(publication?.id).toBe("KLI-RPS-2026-01");
  });

  it("returns null for an unknown slug", async () => {
    get.mockResolvedValue({ docs: [] });
    const { getPublicationBySlug } = await import("@/lib/publications");
    await expect(getPublicationBySlug("missing-record")).resolves.toBeNull();
  });
});
