import type {
  DistributionStatus,
  PublicationDistribution,
  PublicationDistributionEntry,
  PublicationRecord,
  PublicationStatus,
  PublicationVersion,
} from "@/types/publication";

const PUBLICATION_ID_PATTERN = /^KLI-[A-Z0-9]+-\d{4}-\d{2,}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VERSION_PATTERN = /^\d+(?:\.\d+)*$/;

const publicationStatuses = new Set<PublicationStatus>([
  "draft",
  "preprint",
  "published",
  "under-review",
  "accepted",
  "superseded",
  "withdrawn",
]);

const distributionStatuses = new Set<DistributionStatus>([
  "planned",
  "draft",
  "preliminary_upload",
  "submitted",
  "under-review",
  "published",
  "rejected",
  "withdrawn",
  "not-submitted",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function requiredString(value: unknown, field: string): string {
  const normalized = optionalString(value);
  if (!normalized) throw new Error(`Invalid publication ${field}.`);
  return normalized;
}

function asDate(value: unknown, field: string): Date {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  if (isObject(value) && typeof value.toDate === "function") {
    const date = value.toDate();
    if (date instanceof Date && !Number.isNaN(date.valueOf())) return date;
  }
  throw new Error(`Invalid publication ${field}.`);
}

export function isCanonicalPublicationId(value: string): boolean {
  return PUBLICATION_ID_PATTERN.test(value);
}

function normalizeDistributionEntry(value: unknown): PublicationDistributionEntry {
  if (!isObject(value) || !distributionStatuses.has(value.status as DistributionStatus)) {
    throw new Error("Invalid publication distribution status.");
  }
  return {
    status: value.status as DistributionStatus,
    url: optionalString(value.url),
    ...(Object.hasOwn(value, "doi") ? { doi: optionalString(value.doi) } : {}),
    ...(Object.hasOwn(value, "abstractId")
      ? { abstractId: optionalString(value.abstractId) }
      : {}),
    ...(Object.hasOwn(value, "name") ? { name: optionalString(value.name) } : {}),
  };
}

export function normalizeDistributionMetadata(value: unknown): PublicationDistribution {
  if (!isObject(value)) throw new Error("Invalid publication distribution.");
  return {
    ssrn: normalizeDistributionEntry(value.ssrn),
    zenodo: normalizeDistributionEntry(value.zenodo),
    website: normalizeDistributionEntry(value.website),
    journal: normalizeDistributionEntry(value.journal),
  };
}

function normalizeVersion(value: unknown): PublicationVersion {
  if (!isObject(value)) throw new Error("Invalid publication version.");
  const version = requiredString(value.version, "version");
  if (!VERSION_PATTERN.test(version)) throw new Error("Invalid publication version.");
  const status = requiredString(value.status, "version status");
  if (
    !["draft", "journal-preparation", "current", "superseded", "withdrawn"].includes(status)
  ) {
    throw new Error("Invalid publication version status.");
  }
  return {
    version,
    status: status as PublicationVersion["status"],
    public: value.public === true,
    filename: optionalString(value.filename),
    fileUrl: optionalString(value.fileUrl),
    createdAt: value.createdAt == null ? null : asDate(value.createdAt, "version date"),
    notes: optionalString(value.notes),
  };
}

export function getCurrentPublicationVersion(record: PublicationRecord): PublicationVersion | null {
  return record.versions.find((version) => version.version === record.currentVersion) ?? null;
}

export function validateCurrentVersion(record: PublicationRecord): boolean {
  const current = getCurrentPublicationVersion(record);
  return current?.status === "current";
}

export function normalizePublicationRecord(
  documentId: string,
  value: unknown
): PublicationRecord {
  if (!isCanonicalPublicationId(documentId) || !isObject(value)) {
    throw new Error("Invalid canonical publication ID.");
  }

  const id = requiredString(value.id, "ID");
  const slug = requiredString(value.slug, "slug");
  const title = requiredString(value.title, "title");
  const currentVersion = requiredString(value.currentVersion, "current version");
  const publicationDate = requiredString(value.publicationDate, "publication date");
  if (id !== documentId || !SLUG_PATTERN.test(slug) || !VERSION_PATTERN.test(currentVersion)) {
    throw new Error("Invalid publication identity.");
  }
  if (!DATE_PATTERN.test(publicationDate)) throw new Error("Invalid publication date.");
  if (!publicationStatuses.has(value.status as PublicationStatus)) {
    throw new Error("Invalid publication status.");
  }
  if (value.visibility !== "public" && value.visibility !== "private") {
    throw new Error("Invalid publication visibility.");
  }
  if (!Array.isArray(value.authors) || value.authors.length === 0) {
    throw new Error("A publication author is required.");
  }
  if (!isObject(value.series) || !isObject(value.institution)) {
    throw new Error("Invalid publication institutional metadata.");
  }
  if (!isObject(value.identifiers) || !isObject(value.rights) || !isObject(value.citation)) {
    throw new Error("Invalid publication metadata.");
  }
  if (!isObject(value.cta) || !Array.isArray(value.versions) || !Array.isArray(value.keywords)) {
    throw new Error("Invalid publication metadata.");
  }

  const record: PublicationRecord = {
    id,
    slug,
    title,
    subtitle: optionalString(value.subtitle),
    series: {
      name: requiredString(value.series.name, "series name"),
      number: requiredString(value.series.number, "series number"),
    },
    publicationType: requiredString(value.publicationType, "type"),
    status: value.status as PublicationStatus,
    visibility: value.visibility,
    currentVersion,
    publicationDate,
    authors: value.authors.map((author) => {
      if (!isObject(author)) throw new Error("Invalid publication author.");
      return {
        name: requiredString(author.name, "author"),
        orcid: optionalString(author.orcid),
        affiliation: requiredString(author.affiliation, "author affiliation"),
      };
    }),
    institution: {
      name: requiredString(value.institution.name, "institution"),
      office: optionalString(value.institution.office),
      parentEntity: optionalString(value.institution.parentEntity),
    },
    abstract: requiredString(value.abstract, "abstract"),
    keywords: value.keywords.map((keyword) => requiredString(keyword, "keyword")),
    identifiers: {
      orcid: optionalString(value.identifiers.orcid),
      ssrnAbstractId: optionalString(value.identifiers.ssrnAbstractId),
      zenodoDoi: optionalString(value.identifiers.zenodoDoi),
      doi: optionalString(value.identifiers.doi),
      isbn: optionalString(value.identifiers.isbn),
    },
    distribution: normalizeDistributionMetadata(value.distribution),
    versions: value.versions.map(normalizeVersion),
    rights: {
      copyright: requiredString(value.rights.copyright, "copyright"),
      license: requiredString(value.rights.license, "license"),
    },
    citation: {
      preferred: requiredString(value.citation.preferred, "citation"),
    },
    cta: {
      label: requiredString(value.cta.label, "CTA label"),
      url: optionalString(value.cta.url),
    },
    createdAt: asDate(value.createdAt, "created timestamp"),
    updatedAt: asDate(value.updatedAt, "updated timestamp"),
  };

  if (!getCurrentPublicationVersion(record)) {
    throw new Error("Current publication version is missing from version history.");
  }
  return record;
}

export function filterPublications(records: PublicationRecord[]): PublicationRecord[] {
  return records.filter((record) => record.visibility === "public");
}
