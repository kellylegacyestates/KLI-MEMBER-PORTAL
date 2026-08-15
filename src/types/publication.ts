export type PublicationStatus =
  | "draft"
  | "preprint"
  | "published"
  | "under-review"
  | "accepted"
  | "superseded"
  | "withdrawn";

export type DistributionStatus =
  | "planned"
  | "draft"
  | "preliminary_upload"
  | "submitted"
  | "under-review"
  | "published"
  | "rejected"
  | "withdrawn"
  | "not-submitted";

export type PublicationVisibility = "public" | "private";

export type PublicationVersionStatus =
  | "draft"
  | "journal-preparation"
  | "current"
  | "superseded"
  | "withdrawn";

export interface PublicationAuthor {
  name: string;
  orcid: string | null;
  affiliation: string;
}

export interface PublicationSeries {
  name: string;
  number: string;
}

export interface PublicationInstitution {
  name: string;
  office: string | null;
  parentEntity: string | null;
}

export interface PublicationIdentifiers {
  orcid: string | null;
  ssrnAbstractId: string | null;
  zenodoDoi: string | null;
  doi: string | null;
  isbn: string | null;
}

export interface PublicationDistributionEntry {
  status: DistributionStatus;
  url: string | null;
  doi?: string | null;
  abstractId?: string | null;
  name?: string | null;
}

export interface PublicationDistribution {
  ssrn: PublicationDistributionEntry;
  zenodo: PublicationDistributionEntry;
  website: PublicationDistributionEntry;
  journal: PublicationDistributionEntry;
}

export interface PublicationVersion {
  version: string;
  status: PublicationVersionStatus;
  public: boolean;
  filename: string | null;
  fileUrl: string | null;
  createdAt: Date | null;
  notes: string | null;
}

export interface PublicationRights {
  copyright: string;
  license: string;
}

export interface PublicationCitation {
  preferred: string;
}

export interface PublicationCTA {
  label: string;
  url: string | null;
}

export interface PublicationRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  series: PublicationSeries;
  publicationType: string;
  status: PublicationStatus;
  visibility: PublicationVisibility;
  currentVersion: string;
  publicationDate: string;
  authors: PublicationAuthor[];
  institution: PublicationInstitution;
  abstract: string;
  keywords: string[];
  identifiers: PublicationIdentifiers;
  distribution: PublicationDistribution;
  versions: PublicationVersion[];
  rights: PublicationRights;
  citation: PublicationCitation;
  cta: PublicationCTA;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicationUpdate = Pick<
  PublicationRecord,
  "status" | "currentVersion" | "distribution" | "citation" | "cta" | "versions"
>;
