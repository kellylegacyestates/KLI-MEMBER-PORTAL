import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const downloads = [
  { title: "Member handbook", description: "An institutional guide prepared for members navigating the portal and services.", meta: "PDF" },
  { title: "Research index", description: "A structured list of active resources, publications, and archive categories.", meta: "Index" },
  { title: "Curriculum outline", description: "A concise chart of module sequencing, milestones, and reading assignments.", meta: "PDF" },
];

export default function DownloadsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Downloads" title="Institutional documents" description="A secure repository for member handbooks, reference guides, and structured materials." />
        <div className="grid gap-6 md:grid-cols-3">
          {downloads.map((download) => (
            <InfoCard key={download.title} title={download.title} description={download.description} meta={download.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
