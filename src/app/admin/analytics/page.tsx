import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Analytics",
  description: "An analytics overview for the Kelly Legacy Institute member portal.",
};
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const metrics = [
  { label: "Engagement", value: "81%", detail: "Member interaction with current offerings", tone: "navy" as const },
  { label: "Retention", value: "92%", detail: "Returning members in the current quarter", tone: "gold" as const },
  { label: "Completion", value: "74%", detail: "Completion rate across core modules", tone: "parchment" as const },
];

export default function AdminAnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Analytics" description="Institutional engagement metrics prepared for internal review and strategic planning." />
        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
