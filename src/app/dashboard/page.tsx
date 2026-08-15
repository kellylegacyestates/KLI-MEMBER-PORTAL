"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { dashboardWidgets } from "@/lib/institutionalContent";

const institutionalCards = [
  { title: dashboardWidgets.recentPublications.title, description: dashboardWidgets.recentPublications.body, meta: dashboardWidgets.recentPublications.meta },
  { title: dashboardWidgets.weeklyBriefing.title, description: dashboardWidgets.weeklyBriefing.body, meta: dashboardWidgets.weeklyBriefing.meta },
  { title: dashboardWidgets.standingLedger.title, description: dashboardWidgets.standingLedger.body, meta: dashboardWidgets.standingLedger.meta },
  { title: dashboardWidgets.workshops.title, description: dashboardWidgets.workshops.body, meta: dashboardWidgets.workshops.meta },
  { title: dashboardWidgets.announcements.title, description: dashboardWidgets.announcements.body, meta: dashboardWidgets.announcements.meta },
];

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending approval",
  suspended: "Suspended",
};

const roleLabel: Record<string, string> = {
  member: "Member",
  instructor: "Instructor",
  admin: "Administrator",
};

function DashboardContent() {
  const { profile } = useAuth();

  const welcomeTitle = profile?.displayName
    ? `Welcome, ${profile.displayName}`
    : "Welcome back, Member";

  const statusParts: string[] = [];
  if (profile?.role) statusParts.push(roleLabel[profile.role] ?? profile.role);
  if (profile?.membershipStatus) statusParts.push(statusLabel[profile.membershipStatus] ?? profile.membershipStatus);
  if (profile?.institution) statusParts.push(profile.institution);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Home Dashboard"
        title={welcomeTitle}
        description={
          statusParts.length > 0
            ? statusParts.join(" · ")
            : "A curated view of current learning, research, and administrative activity for Kelly Legacy Institute members."
        }
      />

      {/* Member activity — no persistence yet */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#f8f6ee] p-6 shadow-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#6b7280]">Current coursework</p>
          <p className="mt-3 text-sm font-medium text-[#001f3f]">No active course assigned</p>
        </div>
        <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#f8f6ee] p-6 shadow-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#6b7280]">Learning progress</p>
          <p className="mt-3 text-sm font-medium text-[#001f3f]">Progress tracking will appear here</p>
        </div>
        <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#f8f6ee] p-6 shadow-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#6b7280]">Research activity</p>
          <p className="mt-3 text-sm font-medium text-[#001f3f]">No saved activity yet</p>
        </div>
      </div>

      {/* Institutional portal feature cards */}
      <div className="grid gap-6 xl:grid-cols-2">
        {institutionalCards.map((card) => (
          <InfoCard key={card.title} title={card.title} description={card.description} meta={card.meta} />
        ))}
      </div>
    </div>
  );
}

export default function MemberDashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </ProtectedRoute>
  );
}
