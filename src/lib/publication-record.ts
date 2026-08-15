import type { PublicationRecord } from "@/types/publication";

const seededAt = new Date("2026-08-15T00:00:00.000Z");

export const initialPublication: PublicationRecord = {
  id: "KLI-RPS-2026-01",
  slug: "administrative-authority-procedure-and-the-record",
  title:
    "Administrative Authority, Procedure, and the Record: A Framework for Evaluating Federal Agency Action",
  subtitle: null,
  series: {
    name: "KLI Research Paper Series",
    number: "2026-01",
  },
  publicationType: "research-paper",
  status: "preprint",
  visibility: "public",
  currentVersion: "1.3",
  publicationDate: "2026-08-15",
  authors: [
    {
      name: "Delonte D. Kelly",
      orcid: "0009-0002-6556-6542",
      affiliation: "Kelly Legacy Institute",
    },
  ],
  institution: {
    name: "Kelly Legacy Institute",
    office: "Office of the Fiduciary",
    parentEntity: "Kelly Legacy Estates LLC",
  },
  abstract:
    "This paper develops a disciplined analytical sequence for evaluating federal agency action: statute, delegation, procedure, record, finality, and review. Federal administrative law is frequently approached as a body of substantive outcomes rather than as a system of authority, process, and accountability. The paper develops a repeatable primary-source research methodology through which conclusions concerning agency authority, procedure, administrative records, finality, and judicial review remain traceable to statutes, regulations, administrative materials, and judicial authority.",
  keywords: [
    "Administrative Law",
    "Administrative Procedure Act",
    "Federal Agencies",
    "Administrative Record",
    "Judicial Review",
    "Final Agency Action",
    "Rulemaking",
    "Agency Adjudication",
    "Primary Source Research",
    "Delegated Authority",
    "Arbitrary and Capricious Review",
    "Exhaustion of Administrative Remedies",
  ],
  identifiers: {
    orcid: "0009-0002-6556-6542",
    ssrnAbstractId: "7284922",
    zenodoDoi: "10.5281/zenodo.21955550",
    doi: null,
    isbn: null,
  },
  distribution: {
    ssrn: {
      status: "preliminary_upload",
      abstractId: "7284922",
      url: null,
    },
    zenodo: {
      status: "draft",
      doi: "10.5281/zenodo.21955550",
      url: null,
    },
    website: {
      status: "planned",
      url: null,
    },
    journal: {
      status: "not-submitted",
      name: null,
      doi: null,
      url: null,
    },
  },
  versions: [
    {
      version: "1.0",
      status: "superseded",
      public: false,
      filename: null,
      fileUrl: null,
      createdAt: null,
      notes: null,
    },
    {
      version: "1.1",
      status: "journal-preparation",
      public: false,
      filename: null,
      fileUrl: null,
      createdAt: null,
      notes: null,
    },
    {
      version: "1.3",
      status: "current",
      public: true,
      filename:
        "KLI-RPS-2026-01_Administrative-Authority-Procedure-and-the-Record_v1.3.pdf",
      fileUrl: null,
      createdAt: seededAt,
      notes: null,
    },
  ],
  rights: {
    copyright: "© 2026 Delonte D. Kelly",
    license: "CC BY 4.0",
  },
  citation: {
    preferred:
      "Kelly, Delonte D. (2026). Administrative Authority, Procedure, and the Record: A Framework for Evaluating Federal Agency Action. KLI Research Paper Series No. 2026-01, Version 1.3.",
  },
  cta: {
    label: "Study the underlying doctrine inside KLI",
    url: null,
  },
  createdAt: seededAt,
  updatedAt: seededAt,
};
