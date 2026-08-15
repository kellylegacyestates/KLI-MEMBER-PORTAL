import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Content Management",
  description: "Content management tools for the Kelly Legacy Institute member portal.",
};

const contentSections = [
  {
    title: "Curriculum",
    description: "Manage course modules, learning materials, and curriculum structure.",
    href: "/admin/curriculum",
  },
  {
    title: "Publications",
    description: "Publish and manage institutional publications and member briefings.",
    href: "/admin/publications",
  },
  {
    title: "Research Library",
    description: "Curate research materials, references, and library collections.",
    href: "/admin/library",
  },
  {
    title: "Weekly Briefings",
    description: "Coordinate briefing publication, audience targeting, and release status.",
    href: "/admin/briefings",
  },
];

export default async function AdminContentPage() {
  return (
    <AdminRouteGuard pathname="/admin/content">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Content Management"
            title="Institutional content"
            description="Tools for managing curriculum, publications, research materials, and portal content."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {contentSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="block rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2"
              >
                <InfoCard title={section.title} description={section.description}>
                  <span className="text-sm font-semibold text-[#001f3f]">
                    Open manager <span aria-hidden="true">→</span>
                  </span>
                </InfoCard>
              </Link>
            ))}
          </div>
        </div>
      </PortalShell>
    </AdminRouteGuard>
  );
}
