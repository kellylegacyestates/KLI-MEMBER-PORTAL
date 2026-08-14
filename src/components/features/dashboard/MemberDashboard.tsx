"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { MetricCard } from "@/components/ui/MetricCard";
import { InfoCard } from "@/components/ui/InfoCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { dashboardWidgets } from "@/lib/institutionalContent";

// ---------------------------------------------------------------------------
// Static dashboard cards (placeholder activity until real data is wired)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MemberDashboard() {
  const { profile, user, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Loading your dashboard…" />;
  }

  const firstName = profile?.displayName
    ? profile.displayName.split(" ")[0]
    : null;

  const greeting = firstName
    ? `Welcome back, ${firstName}`
    : "Welcome back, Member";

  const memberSince = profile?.createdAt
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(profile.createdAt)
    : null;

  return (
    <div className="space-y-8">
      {/* Live identity banner */}
      <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#001f3f] px-6 py-5 text-[#f5f1de] sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
              Kelly Legacy Institute
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{greeting}</h2>
            {user?.email && (
              <p className="mt-0.5 text-sm text-[#c5bfa8]">{user.email}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {profile?.membershipStatus && (
              <StatusBadge
                label={profile.membershipStatus}
                tone={profile.membershipStatus === "active" ? "navy" : "gold"}
              />
            )}
            {profile?.role && profile.role !== "member" && (
              <StatusBadge label={profile.role} tone="gold" />
            )}
            {memberSince && (
              <span className="text-[0.7rem] text-[#c5bfa8]">Member since {memberSince}</span>
            )}
          </div>
        </div>
      </div>

      {/* Metric summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard label="Current Course" value="7/8" detail="Trust Administration module remains in active study" tone="navy" />
        <MetricCard label="Learning Progress" value="72%" detail="Progress remains on pace for the current cohort" tone="gold" />
        <MetricCard label="Research Activity" value="18" detail="Recent references and annotations saved this month" tone="parchment" />
      </div>

      {/* Content widgets */}
      <div className="grid gap-6 xl:grid-cols-2">
        {dashboardCards.map((card) => (
          <InfoCard key={card.title} title={card.title} description={card.description} meta={card.meta} />
        ))}
      </div>
    </div>
  );
}
