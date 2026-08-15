"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/server";
import { getPublicationById, updatePublication } from "@/lib/publications";
import type {
  DistributionStatus,
  PublicationStatus,
  PublicationVersion,
} from "@/types/publication";

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

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, name: string): string | null {
  return text(formData, name) || null;
}

function validatedUrl(value: string | null): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("External record URLs must use HTTPS.");
  return url.toString();
}

export async function updatePublicationAction(id: string, formData: FormData) {
  const access = await requireAdmin();
  if (access.kind !== "authorized") throw new Error("Not authorized.");

  const publication = await getPublicationById(id);
  if (!publication) throw new Error("Publication not found.");

  const status = text(formData, "status") as PublicationStatus;
  const currentVersion = text(formData, "currentVersion");
  const ssrnStatus = text(formData, "ssrnStatus") as DistributionStatus;
  const zenodoStatus = text(formData, "zenodoStatus") as DistributionStatus;
  const websiteStatus = text(formData, "websiteStatus") as DistributionStatus;
  const journalStatus = text(formData, "journalStatus") as DistributionStatus;
  if (!publicationStatuses.has(status)) throw new Error("Invalid publication status.");
  if (
    ![ssrnStatus, zenodoStatus, websiteStatus, journalStatus].every((value) =>
      distributionStatuses.has(value)
    )
  ) {
    throw new Error("Invalid distribution status.");
  }

  const versions = publication.versions.map((version) => ({
    ...version,
    status:
      version.version === currentVersion
        ? ("current" as const)
        : version.status === "current"
          ? ("superseded" as const)
          : version.status,
  }));

  const newVersion = text(formData, "newVersion");
  if (newVersion) {
    if (versions.some((version) => version.version === newVersion)) {
      throw new Error("Version history entries cannot be overwritten.");
    }
    const entry: PublicationVersion = {
      version: newVersion,
      status: "draft",
      public: false,
      filename: nullableText(formData, "newVersionFilename"),
      fileUrl: null,
      createdAt: new Date(),
      notes: nullableText(formData, "newVersionNotes"),
    };
    versions.push(entry);
  }
  if (!versions.some((version) => version.version === currentVersion)) {
    throw new Error("The current version must exist in version history.");
  }

  await updatePublication(id, {
    status,
    currentVersion,
    distribution: {
      ssrn: {
        ...publication.distribution.ssrn,
        status: ssrnStatus,
        url: validatedUrl(nullableText(formData, "ssrnUrl")),
        abstractId: nullableText(formData, "ssrnAbstractId"),
      },
      zenodo: {
        ...publication.distribution.zenodo,
        status: zenodoStatus,
        url: validatedUrl(nullableText(formData, "zenodoUrl")),
        doi: nullableText(formData, "zenodoDoi"),
      },
      website: {
        ...publication.distribution.website,
        status: websiteStatus,
        url: validatedUrl(nullableText(formData, "websiteUrl")),
      },
      journal: {
        ...publication.distribution.journal,
        status: journalStatus,
        name: nullableText(formData, "journalName"),
        doi: nullableText(formData, "journalDoi"),
        url: validatedUrl(nullableText(formData, "journalUrl")),
      },
    },
    citation: {
      preferred: text(formData, "citation"),
    },
    cta: {
      label: text(formData, "ctaLabel"),
      url: validatedUrl(nullableText(formData, "ctaUrl")),
    },
    versions,
  });

  revalidatePath("/publications");
  revalidatePath(`/publications/${publication.slug}`);
  revalidatePath("/admin/publications");
  revalidatePath(`/admin/publications/${id}`);
  redirect(`/admin/publications/${id}?saved=1`);
}
