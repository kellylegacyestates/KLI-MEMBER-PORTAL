"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { MetricCard } from "@/components/ui/MetricCard";
import { InfoCard } from "@/components/ui/InfoCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { dashboardWidgets } from "@/lib/institutionalContent";

const dashboardCards = [
  { ...dashboardWidgets.recentPublications, href: "/publications", action: "Browse publications" },
  { ...dashboardWidgets.researchActivity, href: "/research-library", action: "Open research library" },
  { ...dashboardWidgets.weeklyBriefing, href: "/briefings", action: "View recent briefings" },
];

const resourceLinks = [
  { label: "Downloads", href: "/downloads" },
  { label: "Certificates", href: "/certificates" },
  { label: "Profile", href: "/profile" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MemberDashboard() {
  const { profile, user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Loading your dashboard…" />;
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

      <section>
        <InfoCard
          title={dashboardWidgets.continueLearning.title}
          description={dashboardWidgets.continueLearning.body}
          meta={dashboardWidgets.continueLearning.meta}
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/curriculum"
              className="inline-flex min-h-11 items-center rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#001f3f] transition hover:bg-[#e0c35a]"
            >
              Continue learning
            </Link>
            <Link
              href="/courses"
              className="inline-flex min-h-11 items-center rounded-full border border-[#d8d0bc] px-5 py-2.5 text-sm font-semibold text-[#001f3f] transition hover:bg-[#f5f1de]"
            >
              View courses
            </Link>
          </div>
        </InfoCard>
      </section>

      {/* Metric summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard label="Current Coursework" value="—" detail="No active course assigned" tone="navy" />
        <MetricCard label="Learning Progress" value="—" detail="Progress tracking will appear here" tone="gold" />
        <MetricCard label="Research Activity" value="—" detail="No saved activity yet" tone="parchment" />
      </div>

      <section aria-labelledby="institutional-resources-title" className="space-y-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
            Institutional resources
          </p>
          <h2 id="institutional-resources-title" className="mt-2 text-2xl font-semibold text-[#001f3f]">
            Research and current releases
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <InfoCard key={card.title} title={card.title} description={card.body} meta={card.meta}>
            <Link
              href={card.href}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-[#001f3f] underline decoration-[#d4af37] underline-offset-4"
            >
              {card.action} →
            </Link>
          </InfoCard>
        ))}
        </div>
      </section>

      <nav aria-label="Member resources" className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#f8f6ee] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#001f3f]">Member records and account</h2>
            <p className="mt-1 text-sm text-[#526276]">Access your resources without leaving your institutional home.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {resourceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-full border border-[#d8d0bc] bg-white px-4 py-2 text-sm font-semibold text-[#001f3f] transition hover:bg-[#f5f1de]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
