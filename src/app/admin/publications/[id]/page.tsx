import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";
import { PortalShell } from "@/components/layout/PortalShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublicationById } from "@/lib/publications";
import { updatePublicationAction } from "./actions";

export const metadata: Metadata = {
  title: "Edit Publication Record",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#d8d0bc] bg-white px-3 py-2 text-sm text-[#001f3f]";
const labelClass = "text-sm font-semibold text-[#243449]";
const statuses = [
  "draft",
  "preprint",
  "published",
  "under-review",
  "accepted",
  "superseded",
  "withdrawn",
] as const;
const distributionStatuses = [
  "planned",
  "draft",
  "preliminary_upload",
  "submitted",
  "under-review",
  "published",
  "rejected",
  "withdrawn",
  "not-submitted",
] as const;

function DistributionFields({
  name,
  label,
  status,
  url,
  children,
}: {
  name: string;
  label: string;
  status: string;
  url: string | null;
  children?: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-[#d8d0bc] p-4">
      <legend className="px-2 font-semibold text-[#001f3f]">{label}</legend>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Status
          <select name={`${name}Status`} defaultValue={status} className={inputClass}>
            {distributionStatuses.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Verified URL
          <input name={`${name}Url`} type="url" defaultValue={url ?? ""} className={inputClass} />
        </label>
        {children}
      </div>
    </fieldset>
  );
}

async function PublicationEditor({
  id,
  saved,
}: {
  id: string;
  saved: boolean;
}) {
  let publication;
  try {
    publication = await getPublicationById(id);
  } catch {
    return (
      <ErrorState
        title="Publication record unavailable"
        description="The record could not be retrieved. No changes were made."
      />
    );
  }
  if (!publication) notFound();

  const action = updatePublicationAction.bind(null, publication.id);

  return (
    <div className="space-y-8">
      <Link href="/admin/publications" className="text-sm font-semibold text-[#526276]">
        ← Publication registry
      </Link>
      <SectionHeader
        eyebrow={publication.id}
        title={publication.title}
        description="Update mutable publication metadata while preserving the canonical identifier and prior version records."
      />
      {saved ? (
        <p role="status" className="rounded-xl border border-[#d4af37] bg-[#fffdf3] px-4 py-3 text-sm text-[#001f3f]">
          Publication record updated.
        </p>
      ) : null}
      <form action={action} className="space-y-8">
        <section className="grid gap-5 rounded-3xl border border-[#d8d0bc] bg-white p-6 md:grid-cols-2">
          <label className={labelClass}>
            Publication status
            <select name="status" defaultValue={publication.status} className={inputClass}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Current version
            <select name="currentVersion" defaultValue={publication.currentVersion} className={inputClass}>
              {publication.versions.map((version) => (
                <option key={version.version} value={version.version}>{version.version}</option>
              ))}
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Preferred citation
            <textarea name="citation" required rows={4} defaultValue={publication.citation.preferred} className={inputClass} />
          </label>
        </section>

        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-[#001f3f]">Distribution records</h2>
          <DistributionFields name="ssrn" label="SSRN" status={publication.distribution.ssrn.status} url={publication.distribution.ssrn.url}>
            <label className={labelClass}>Abstract ID<input name="ssrnAbstractId" defaultValue={publication.distribution.ssrn.abstractId ?? ""} className={inputClass} /></label>
          </DistributionFields>
          <DistributionFields name="zenodo" label="Zenodo" status={publication.distribution.zenodo.status} url={publication.distribution.zenodo.url}>
            <label className={labelClass}>DOI<input name="zenodoDoi" defaultValue={publication.distribution.zenodo.doi ?? ""} className={inputClass} /></label>
          </DistributionFields>
          <DistributionFields name="website" label="Website" status={publication.distribution.website.status} url={publication.distribution.website.url} />
          <DistributionFields name="journal" label="Journal" status={publication.distribution.journal.status} url={publication.distribution.journal.url}>
            <label className={labelClass}>Journal name<input name="journalName" defaultValue={publication.distribution.journal.name ?? ""} className={inputClass} /></label>
            <label className={labelClass}>Journal DOI<input name="journalDoi" defaultValue={publication.distribution.journal.doi ?? ""} className={inputClass} /></label>
          </DistributionFields>
        </section>

        <section className="grid gap-5 rounded-3xl border border-[#d8d0bc] bg-white p-6 md:grid-cols-2">
          <h2 className="text-xl font-semibold text-[#001f3f] md:col-span-2">Public CTA</h2>
          <label className={labelClass}>Label<input name="ctaLabel" required defaultValue={publication.cta.label} className={inputClass} /></label>
          <label className={labelClass}>URL<input name="ctaUrl" type="url" defaultValue={publication.cta.url ?? ""} className={inputClass} /></label>
        </section>

        <section className="grid gap-5 rounded-3xl border border-[#d8d0bc] bg-white p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-[#001f3f]">Add version-history entry</h2>
            <p className="mt-2 text-sm text-[#526276]">Leave blank when no version entry is being added. Existing versions cannot be overwritten.</p>
          </div>
          <label className={labelClass}>Version<input name="newVersion" placeholder="1.4" className={inputClass} /></label>
          <label className={labelClass}>Filename<input name="newVersionFilename" className={inputClass} /></label>
          <label className={`${labelClass} md:col-span-2`}>Notes<textarea name="newVersionNotes" rows={3} className={inputClass} /></label>
        </section>

        <button type="submit" className="rounded-full bg-[#001f3f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002f5f]">
          Save publication record
        </button>
      </form>
    </div>
  );
}

export default async function AdminPublicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  return (
    <AdminRouteGuard pathname={`/admin/publications/${id}`}>
      <PortalShell>
        <PublicationEditor id={id} saved={saved === "1"} />
      </PortalShell>
    </AdminRouteGuard>
  );
}
