import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const metrics = [
  { label: "Active Courses", value: "8", detail: "Two new modules recently released", tone: "navy" as const },
  { label: "Briefings", value: "12", detail: "Current review cycle is on schedule", tone: "gold" as const },
  { label: "Library Access", value: "94%", detail: "Articles and archival materials available", tone: "parchment" as const },
];

const agenda = [
  { title: "Research review", description: "Prepare notes for the forthcoming legislative analysis seminar.", meta: "Today" },
  { title: "Curriculum milestone", description: "Complete the standing ledger and review the latest assigned module.", meta: "Tomorrow" },
  { title: "Billing review", description: "Confirm account activity and upcoming invoice details.", meta: "This week" },
];

export default function MemberDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Member Overview" title="Institutional dashboard" description="A curated view of current learning, research, and administrative activity for Kelly Legacy Institute members." />

        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <InfoCard title="Current focus" description="Members are guided through evidence, standing, and archival research in a structured sequence.">
            <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-[#f8f6ee] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d4af37]">Recommended next step</p>
              <p className="mt-3 text-base leading-8 text-[#243449]">Continue the current curriculum module on administrative procedure and prepare a short note for your next seminar session.</p>
            </div>
          </InfoCard>
          <InfoCard title="Institutional notices" description="Administrative updates maintained for member awareness." />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {agenda.map((item) => (
            <InfoCard key={item.title} title={item.title} description={item.description} meta={item.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
