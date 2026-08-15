import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPublications } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications",
  description: "The authoritative public publication record of Kelly Legacy Institute.",
};

function shortAbstract(abstract: string): string {
  return abstract.length > 360 ? `${abstract.slice(0, 357).trimEnd()}…` : abstract;
}

export default async function PublicationsPage() {
  await connection();

  let publications;
  try {
    publications = await getPublications();
  } catch {
    return (
      <PublicLayout>
        <ErrorState
          title="Publication registry unavailable"
          description="The institutional record could not be retrieved. Please try again later."
        />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-10">
        <SectionHeader
          eyebrow="Publications Registry"
          title="Institutional publication record"
          description="Canonical records for Kelly Legacy Institute research, with version and distribution history preserved under one stable publication identifier."
        />

        {publications.length === 0 ? (
          <EmptyState
            title="No public records"
            description="No publication records are currently designated for public access."
          />
        ) : (
          <div className="divide-y divide-[#d8d0bc] border-y border-[#d8d0bc]">
            {publications.map((publication) => (
              <article key={publication.id} className="grid gap-5 py-8 lg:grid-cols-[1fr_auto]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge label={publication.status} tone="gold" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#526276]">
                      {publication.id}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#526276]">
                      {publication.series.name} No. {publication.series.number}
                    </p>
                    <h2 className="mt-2 max-w-4xl text-2xl font-semibold leading-tight text-[#001f3f]">
                      <Link
                        href={`/publications/${publication.slug}`}
                        className="decoration-[#d4af37] underline-offset-4 hover:underline"
                      >
                        {publication.title}
                      </Link>
                    </h2>
                  </div>
                  <p className="text-sm text-[#243449]">
                    {publication.authors.map((author) => author.name).join(", ")} · Version{" "}
                    {publication.currentVersion} · {publication.publicationDate}
                  </p>
                  <p className="max-w-4xl text-sm leading-7 text-[#243449]">
                    {shortAbstract(publication.abstract)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.slice(0, 5).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-[#d8d0bc] bg-white px-3 py-1 text-xs text-[#243449]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#526276]">
                    {publication.identifiers.ssrnAbstractId
                      ? `SSRN Abstract ID ${publication.identifiers.ssrnAbstractId}`
                      : null}
                    {publication.identifiers.ssrnAbstractId &&
                    publication.identifiers.zenodoDoi
                      ? " · "
                      : null}
                    {publication.identifiers.zenodoDoi
                      ? `Zenodo DOI ${publication.identifiers.zenodoDoi}`
                      : null}
                  </p>
                </div>
                <div className="lg:pt-10">
                  <Link
                    href={`/publications/${publication.slug}`}
                    className="inline-flex rounded-full bg-[#001f3f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002f5f]"
                  >
                    View record
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
