import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { dashboardWidgets } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A production-ready institutional dashboard for Kelly Legacy Institute members.",
};

const metrics = [
  { label: "Current Course", value: "7/8", detail: "Trust Administration module remains in active study", tone: "navy" as const },
  { label: "Learning Progress", value: "72%", detail: "Progress remains on pace for the current cohort", tone: "gold" as const },
  { label: "Research Activity", value: "18", detail: "Recent references and annotations saved this month", tone: "parchment" as const },
];

const dashboardCards = [
  { title: dashboardWidgets.currentCourse.title, description: dashboardWidgets.currentCourse.body, meta: dashboardWidgets.currentCourse.meta },
  { title: dashboardWidgets.learningProgress.title, description: dashboardWidgets.learningProgress.body, meta: dashboardWidgets.learningProgress.meta },
  { title: dashboardWidgets.recentPublications.title, description: dashboardWidgets.recentPublications.body, meta: dashboardWidgets.recentPublications.meta },
  { title: dashboardWidgets.weeklyBriefing.title, description: dashboardWidgets.weeklyBriefing.body, meta: dashboardWidgets.weeklyBriefing.meta },
  { title: dashboardWidgets.continueLearning.title, description: dashboardWidgets.continueLearning.body, meta: dashboardWidgets.continueLearning.meta },
  { title: dashboardWidgets.savedResources.title, description: dashboardWidgets.savedResources.body, meta: dashboardWidgets.savedResources.meta },
  { title: dashboardWidgets.researchActivity.title, description: dashboardWidgets.researchActivity.body, meta: dashboardWidgets.researchActivity.meta },
  { title: dashboardWidgets.standingLedger.title, description: dashboardWidgets.standingLedger.body, meta: dashboardWidgets.standingLedger.meta },
  { title: dashboardWidgets.workshops.title, description: dashboardWidgets.workshops.body, meta: dashboardWidgets.workshops.meta },
  { title: dashboardWidgets.announcements.title, description: dashboardWidgets.announcements.body, meta: dashboardWidgets.announcements.meta },
];

export default function MemberDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Home Dashboard"
          title={dashboardWidgets.welcome}
          description="A curated view of current learning, research, and administrative activity for Kelly Legacy Institute members."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {dashboardCards.map((card) => (
            <InfoCard key={card.title} title={card.title} description={card.description} meta={card.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
