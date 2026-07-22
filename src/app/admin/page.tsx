import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { adminPanels } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Administration",
  description: "An administrative dashboard for the Kelly Legacy Institute member portal.",
};

const metrics = [
  { label: "Members", value: "182", detail: "Active institutional accounts", tone: "navy" as const },
  { label: "Courses", value: "24", detail: "Current curriculum modules published", tone: "gold" as const },
  { label: "Library Items", value: "1,240", detail: "Research materials available", tone: "parchment" as const },
];

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administrator Dashboard" title="Institutional oversight" description="Administrative tools for managing members, curriculum, publications, and research resources." />
        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {adminPanels.map((panel) => (
            <InfoCard key={panel.title} title={panel.title} description={panel.description} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
