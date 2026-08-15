import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/layout/PortalShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Administration",
  description: "An administrative dashboard for the Kelly Legacy Institute member portal.",
};

const metrics = [
  { label: "Members", value: "182", detail: "Active institutional accounts", tone: "navy" as const },
  { label: "Courses", value: "24", detail: "Current curriculum modules published", tone: "gold" as const },
  { label: "Library Items", value: "1,240", detail: "Research materials available", tone: "parchment" as const },
];

const adminPanels = [
  { title: "Members", description: "Member records and institutional access status.", href: "/admin/members" },
  { title: "Access Control", description: "Role, account, and membership authorization tools.", href: "/admin/access" },
  { title: "Content", description: "Entry point for institutional content management.", href: "/admin/content" },
  { title: "Publications", description: "Publication records, versions, and release status.", href: "/admin/publications" },
  { title: "Curriculum", description: "Curriculum modules and publication readiness.", href: "/admin/curriculum" },
  { title: "Research Library", description: "Library records and reference availability.", href: "/admin/library" },
  { title: "Briefings", description: "Briefing publication and release calendar.", href: "/admin/briefings" },
  { title: "Analytics", description: "Institutional engagement metrics.", href: "/admin/analytics" },
];

export default async function AdminDashboardPage() {
  return (
    <AdminRouteGuard pathname="/admin">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader eyebrow="Administrator Dashboard" title="Institutional oversight" description="Administrative tools for managing members, curriculum, publications, and research resources." />
          <div className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {adminPanels.map((panel) => (
              <InfoCard key={panel.title} title={panel.title} description={panel.description}>
                <Link
                  href={panel.href}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-[#001f3f] underline decoration-[#d4af37] underline-offset-4"
                >
                  Open {panel.title} →
                </Link>
              </InfoCard>
            ))}
          </div>
        </div>
      </PortalShell>
    </AdminRouteGuard>
  );
}
