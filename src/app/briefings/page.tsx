import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const briefings = [
  { title: "Federal oversight update", description: "A summary of recent developments affecting institutional practice and governance.", meta: "Weekly" },
  { title: "Research agenda briefing", description: "A concise issue brief prepared for member review ahead of the next seminar.", meta: "Prepared" },
  { title: "Member communications", description: "Administrative guidance, access notices, and institutional updates for active members.", meta: "Current" },
];

export default function BriefingsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Weekly Briefings" title="Briefing archive" description="Structured communications curated for members and administrators with a professional institutional tone." />
        <div className="grid gap-6 md:grid-cols-3">
          {briefings.map((briefing) => (
            <InfoCard key={briefing.title} title={briefing.title} description={briefing.description} meta={briefing.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
