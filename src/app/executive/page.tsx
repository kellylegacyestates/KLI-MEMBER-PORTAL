import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { ExecutiveRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Executive Overview",
  description: "Executive leadership and governance dashboard for Kelly Legacy Institute.",
};

const executivePanels = [
  {
    title: "Execution Framework",
    description: "Operational frameworks, fiduciary directives, and institutional execution standards.",
  },
  {
    title: "Institutional Governance",
    description: "Governance records, policy instruments, and institutional oversight documentation.",
  },
  {
    title: "Strategic Initiatives",
    description: "Active institutional initiatives, priorities, and leadership directives.",
  },
  {
    title: "Reports and Summaries",
    description: "Executive-level summaries, performance reports, and institutional assessments.",
  },
];

export default async function ExecutiveDashboardPage() {
  return (
    <ExecutiveRouteGuard pathname="/executive">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Executive Dashboard"
            title="Leadership and governance"
            description="Executive tools and governance resources for Kelly Legacy Institute leadership."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {executivePanels.map((panel) => (
              <InfoCard
                key={panel.title}
                title={panel.title}
                description={panel.description}
              />
            ))}
          </div>
        </div>
      </PortalShell>
    </ExecutiveRouteGuard>
  );
}
