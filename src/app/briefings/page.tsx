import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { briefingEntries } from "@/lib/institutionalContent";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Briefings",
  description: "The weekly briefing archive for Kelly Legacy Institute members, covering governance, records, and fiduciary practice.",
};

export default async function BriefingsPage() {
  return (
    <MemberRouteGuard pathname="/briefings">
      <PortalShell>
          <div className="space-y-8">
            <SectionHeader
              eyebrow="Weekly Briefings"
              title="Institutional briefing archive"
              description="Structured communications curated for members and administrators with a professional institutional tone."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {briefingEntries.map((briefing) => (
                <InfoCard key={briefing.title} title={briefing.title} description={briefing.summary} meta={briefing.date} />
              ))}
            </div>
          </div>
        </PortalShell>
    </MemberRouteGuard>
  );
}
