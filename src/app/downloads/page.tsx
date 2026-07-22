import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { downloadEntries } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Downloads",
  description: "The institutional documents repository for Kelly Legacy Institute members.",
};

export default function DownloadsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Downloads"
          title="Institutional documents"
          description="A secure repository for member handbooks, reference guides, and structured materials."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {downloadEntries.map((download) => (
            <InfoCard key={download.title} title={download.title} description={download.description} meta={download.type}>
              <p className="mt-3 text-sm leading-7 text-[#243449]">File size: {download.size}</p>
            </InfoCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
