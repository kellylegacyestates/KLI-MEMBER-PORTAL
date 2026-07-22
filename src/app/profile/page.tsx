import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { accountSections } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Account",
  description: "The account overview for Kelly Legacy Institute members.",
};

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Account"
          title="Member account"
          description="A central record for institutional identity, contact details, and professional interests."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {accountSections.map((section) => (
            <InfoCard key={section.title} title={section.title} description={section.description} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
