import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { AdminRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Security audit log for the Kelly Legacy Institute member portal.",
};

const auditSections = [
  {
    title: "Authentication Events",
    description: "Login attempts, session creation, and logout events with timestamps.",
  },
  {
    title: "Access Events",
    description: "Protected route access, authorization decisions, and denial records.",
  },
  {
    title: "Admin Actions",
    description: "Administrative actions including role changes and membership updates.",
  },
  {
    title: "Security Alerts",
    description: "Flagged events, anomalous access patterns, and security notifications.",
  },
];

export default async function AdminAuditPage() {
  return (
    <AdminRouteGuard pathname="/admin/audit">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Audit Log"
            title="Security and access audit"
            description="Comprehensive audit log of authentication events, access decisions, and administrative actions."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {auditSections.map((section) => (
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
