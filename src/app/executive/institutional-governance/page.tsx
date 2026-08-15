import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { ExecutiveRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Institutional Governance",
  description: "Institutional governance documentation for Kelly Legacy Institute.",
};

const governanceSections = [
  {
    title: "Governance Instruments",
    description: "Foundational governance documents, charters, and policy instruments.",
  },
  {
    title: "Policy Registry",
    description: "Active and archived institutional policies with effective dates.",
  },
  {
    title: "Oversight Records",
    description: "Records of institutional oversight activities and reviews.",
  },
  {
    title: "Leadership Structure",
    description: "Organizational structure, roles, and authorities within the institution.",
  },
];

export default async function InstitutionalGovernancePage() {
  return (
    <ExecutiveRouteGuard pathname="/executive/institutional-governance">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Institutional Governance"
            title="Governance and oversight"
            description="Policy instruments, governance records, and institutional oversight documentation."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {governanceSections.map((section) => (
              <InfoCard
                key={section.title}
                title={section.title}
                description={section.description}
              />
            ))}
          </div>
        </div>
      </PortalShell>
    </ExecutiveRouteGuard>
  );
}
