import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getValidPublicFileUrl } from "@/lib/publication-validation";
import { getPublicationBySlug } from "@/lib/publications";
import type { PublicationDistributionEntry } from "@/types/publication";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function ExternalRecord({
  label,
  identifier,
  entry,
}: {
  label: string;
  identifier: string | null;
  entry: PublicationDistributionEntry;
}) {
  if (!identifier && !entry.name && !entry.url) return null;
  return (
    <div className="border-t border-[#e7e1d3] py-4 first:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-[#001f3f]">{label}</h3>
        <StatusBadge label={entry.status} tone="ivory" />
      </div>
      {entry.name ? <p className="mt-2 text-sm text-[#243449]">{entry.name}</p> : null}
      {identifier ? <p className="mt-2 font-mono text-sm text-[#243449]">{identifier}</p> : null}
      {entry.url ? (
        <a
          href={entry.url}
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-[#001f3f] underline decoration-[#d4af37] underline-offset-4"
        >
          View verified record
        </a>
      ) : null}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  try {
    const publication = await getPublicationBySlug(slug);
    return publication
      ? { title: publication.title, description: publication.abstract }
      : { title: "Publication not found" };
  } catch {
    return { title: "Publication Registry" };
  }
}

export default async function PublicationDetailPage({ params }: PageProps) {
  await connection();
  const { slug } = await params;

  let publication;
  try {
    publication = await getPublicationBySlug(slug);
  } catch {
    return (
      <PublicLayout>
        <ErrorState
          title="Publication record unavailable"
          description="The institutional record could not be retrieved. Please try again later."
        />
      </PublicLayout>
    );
  }
  if (!publication) notFound();

  const fileUrl = getValidPublicFileUrl(publication);

  return (
    <PublicLayout>
      <article className="mx-auto max-w-5xl space-y-10">
        <Link href="/publications" className="text-sm font-semibold text-[#526276] hover:text-[#001f3f]">
          ← Publications registry
        </Link>

        <header className="space-y-5 border-b border-[#d8d0bc] pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge label={publication.status} tone="gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#526276]">
              {publication.id}
            </span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#526276]">
            {publication.series.name} · No. {publication.series.number}
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-[#001f3f] sm:text-5xl">
            {publication.title}
          </h1>
          {publication.subtitle ? (
            <p className="text-xl text-[#526276]">{publication.subtitle}</p>
          ) : null}
          <dl className="grid gap-4 pt-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="font-semibold text-[#526276]">Author</dt><dd className="mt-1 text-[#001f3f]">{publication.authors.map((author) => author.name).join(", ")}</dd></div>
            <div><dt className="font-semibold text-[#526276]">Affiliation</dt><dd className="mt-1 text-[#001f3f]">{publication.authors[0]?.affiliation}</dd></div>
            <div><dt className="font-semibold text-[#526276]">Published</dt><dd className="mt-1 text-[#001f3f]">{publication.publicationDate}</dd></div>
            <div><dt className="font-semibold text-[#526276]">Current version</dt><dd className="mt-1 text-[#001f3f]">{publication.currentVersion}</dd></div>
          </dl>
          {publication.authors[0]?.orcid ? (
            <p className="text-sm text-[#526276]">ORCID {publication.authors[0].orcid}</p>
          ) : null}
          {fileUrl ? (
            <a href={fileUrl} className="inline-flex rounded-full bg-[#001f3f] px-5 py-2.5 text-sm font-semibold text-white">
              Download current version
            </a>
          ) : null}
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-[#001f3f]">Abstract</h2>
          <p className="mt-4 text-base leading-8 text-[#243449]">{publication.abstract}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {publication.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-[#d8d0bc] bg-white px-3 py-1 text-xs text-[#243449]">{keyword}</span>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-[#d8d0bc] bg-white p-6">
            <h2 className="text-xl font-semibold text-[#001f3f]">Identifiers and distribution</h2>
            <div className="mt-3">
              <ExternalRecord label="SSRN" identifier={publication.identifiers.ssrnAbstractId ? `Abstract ID ${publication.identifiers.ssrnAbstractId}` : null} entry={publication.distribution.ssrn} />
              <ExternalRecord label="Zenodo" identifier={publication.identifiers.zenodoDoi ? `DOI ${publication.identifiers.zenodoDoi}` : null} entry={publication.distribution.zenodo} />
              <ExternalRecord label="Website" identifier={null} entry={publication.distribution.website} />
              <ExternalRecord label="Journal" identifier={publication.distribution.journal.doi ? `DOI ${publication.distribution.journal.doi}` : null} entry={publication.distribution.journal} />
            </div>
          </section>

          <section className="rounded-3xl border border-[#d8d0bc] bg-white p-6">
            <h2 className="text-xl font-semibold text-[#001f3f]">Version history</h2>
            <ol className="mt-3 divide-y divide-[#e7e1d3]">
              {[...publication.versions].reverse().map((version) => (
                <li key={version.version} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-semibold text-[#001f3f]">Version {version.version}</p>
                    <p className="mt-1 text-sm text-[#526276]">{version.status}</p>
                  </div>
                  {version.public ? <StatusBadge label="Public" tone="parchment" /> : null}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="border-y border-[#d8d0bc] py-8">
          <h2 className="text-xl font-semibold text-[#001f3f]">Preferred citation</h2>
          <p className="mt-4 leading-7 text-[#243449]">{publication.citation.preferred}</p>
          <p className="mt-6 text-sm text-[#526276]">
            {publication.rights.copyright} · {publication.rights.license}
          </p>
        </section>

        <section className="rounded-3xl bg-[#001f3f] px-6 py-8 text-[#f5f1de] sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">Related study</p>
          <h2 className="mt-3 text-2xl font-semibold">{publication.cta.label}</h2>
          {publication.cta.url ? (
            <a href={publication.cta.url} className="mt-5 inline-flex rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#001f3f]">
              Continue to KLI study
            </a>
          ) : (
            <p className="mt-3 text-sm text-[#d8d0bc]">Related study access will be added when available.</p>
          )}
        </section>
      </article>
    </PublicLayout>
  );
}
