import type { Metadata } from "next";
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
  },
  {
    title: "Publications",
    description: "Publish and manage institutional publications and member briefings.",
  },
  {
    title: "Research Library",
    description: "Curate research materials, references, and library collections.",
  },
  {
    title: "Announcements",
    description: "Create and manage member announcements and portal notices.",
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
              <InfoCard
                key={section.title}
                title={section.title}
                description={section.description}
              />
            ))}
          </div>
        </div>
      </PortalShell>
    </AdminRouteGuard>
  );
}
