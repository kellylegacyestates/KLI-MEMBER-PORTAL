import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { publicationEntries } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Publications",
  description: "The institutional publication archive for Kelly Legacy Institute members and fellows.",
};

export default function PublicationsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Publications"
          title="Institutional publications"
          description="Professional materials prepared for members with the tone of an executive archive and scholarly press."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {publicationEntries.map((publication) => (
            <InfoCard key={publication.title} title={publication.title} description={publication.summary} meta={publication.type}>
              <p className="text-sm leading-7 text-[#243449]">Issued: {publication.issued}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
