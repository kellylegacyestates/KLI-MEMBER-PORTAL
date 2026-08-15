import { describe, expect, it } from "vitest";
import { initialPublication } from "@/lib/publication-record";
import {
  filterPublications,
  getCurrentPublicationVersion,
  getValidPublicFileUrl,
  isCanonicalPublicationId,
  normalizeDistributionMetadata,
  normalizePublicationRecord,
  validateCurrentVersion,
} from "@/lib/publication-validation";

describe("publication record integrity", () => {
  it("filters records to explicit public visibility", () => {
    const privateRecord = { ...initialPublication, id: "KLI-RPS-2026-02", visibility: "private" as const };
    expect(filterPublications([initialPublication, privateRecord])).toEqual([initialPublication]);
  });

  it("enforces canonical institutional IDs", () => {
    expect(isCanonicalPublicationId("KLI-RPS-2026-01")).toBe(true);
    expect(isCanonicalPublicationId("random-firestore-id")).toBe(false);
    expect(() => normalizePublicationRecord("random-firestore-id", initialPublication)).toThrow(
      "Invalid canonical publication ID"
    );
  });

  it("resolves and validates the current version state", () => {
    expect(getCurrentPublicationVersion(initialPublication)?.version).toBe("1.3");
    expect(validateCurrentVersion(initialPublication)).toBe(true);
    expect(
      validateCurrentVersion({
        ...initialPublication,
        versions: initialPublication.versions.map((version) =>
          version.version === "1.3" ? { ...version, status: "draft" } : version
        ),
      })
    ).toBe(false);
  });

  it("normalizes absent distribution URLs without fabricating values", () => {
    const distribution = normalizeDistributionMetadata(initialPublication.distribution);
    expect(distribution.ssrn.abstractId).toBe("7284922");
    expect(distribution.ssrn.url).toBeNull();
    expect(distribution.zenodo.doi).toBe("10.5281/zenodo.21955550");
    expect(distribution.zenodo.status).toBe("draft");
  });

  it("does not expose a download when the public file URL is missing or unsafe", () => {
    expect(getValidPublicFileUrl(initialPublication)).toBeNull();
    const unsafe = {
      ...initialPublication,
      versions: initialPublication.versions.map((version) =>
        version.version === "1.3"
          ? { ...version, fileUrl: "javascript:alert(1)" }
          : version
      ),
    };
    expect(getValidPublicFileUrl(unsafe)).toBeNull();
  });
});
