import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";
import { AuthorizationUpdateForm } from "@/components/features/admin/AuthorizationUpdateForm";
import { SessionRevocationForm } from "@/components/features/admin/SessionRevocationForm";

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
    title: "Account Status",
    description: "Review account eligibility using controlled states: active, suspended, or revoked.",
  },
  {
    title: "Membership Status",
    description: "Review educational membership eligibility: active, pending, suspended, expired, or revoked.",
  },
  {
    title: "Session Management",
    description: "Current-session logout is implemented; global revocation and sign-out-all-devices remain deferred privileged-server work.",
  },
  {
    title: "Access Policies",
    description: "Route policies are enforced server-side: members require active account plus active membership; admins require active account plus admin role.",
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
          <AuthorizationUpdateForm />
          <SessionRevocationForm />
        </div>
      </PortalShell>
    </AdminRouteGuard>
  );
}
