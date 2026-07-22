import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Publications",
  description: "A sample publications area for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const publications = [
  { title: "Quarterly Review", description: "A formal publication discussing recent developments in governance, practice, and stewardship.", meta: "New" },
  { title: "Research Bulletin", description: "A concise bulletin covering institutional updates and emerging research concerns.", meta: "Issued" },
  { title: "Member Memo", description: "A curated resource summarizing notable reading and administrative guidance.", meta: "Archived" },
];

export default function PublicationsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Publications" title="Institutional publications" description="Professional materials prepared for members with the tone of an executive archive and scholarly press." />
        <div className="grid gap-6 md:grid-cols-3">
          {publications.map((publication) => (
            <InfoCard key={publication.title} title={publication.title} description={publication.description} meta={publication.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
