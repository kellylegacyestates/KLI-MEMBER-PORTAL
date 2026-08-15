import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Access Control",
  description: "Access control and role management for the Kelly Legacy Institute member portal.",
};

const accessSections = [
  {
    title: "Role Assignments",
    description: "Assign and review member roles including member, instructor, executive, and admin.",
  },
  {
    title: "Membership Status",
    description: "Review and update membership status: active, pending, suspended, expired, or revoked.",
  },
  {
    title: "Session Management",
    description: "Review active sessions and revoke tokens when required.",
  },
  {
    title: "Access Policies",
    description: "Configure route-level access policies and permissions.",
  },
];

export default async function AdminAccessPage() {
  return (
    <AdminRouteGuard pathname="/admin/access">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Access Control"
            title="Role and access management"
            description="Manage member roles, membership states, and access control policies."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {accessSections.map((section) => (
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
