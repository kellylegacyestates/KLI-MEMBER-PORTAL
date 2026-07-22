import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { briefingEntries } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Briefings",
  description: "The weekly briefing archive for Kelly Legacy Institute members, covering governance, records, and fiduciary practice.",
};

export default function BriefingsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Weekly Briefings"
          title="Institutional briefing archive"
          description="Structured communications curated for members and administrators with a professional institutional tone."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {briefingEntries.map((briefing) => (
            <InfoCard key={briefing.title} title={briefing.title} description={briefing.summary} meta={briefing.date}>
              <button type="button" className="mt-3 rounded-full border border-[#d8d0bc] bg-[#f8f6ee] px-3 py-2 text-sm font-medium text-[#001f3f]">Read More</button>
            </InfoCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
