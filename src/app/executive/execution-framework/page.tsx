import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { ExecutiveRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Execution Framework",
  description: "Operational execution framework for Kelly Legacy Institute.",
};

const frameworkSections = [
  {
    title: "Fiduciary Directives",
    description: "Binding fiduciary standards and institutional execution requirements.",
  },
  {
    title: "Operational Protocols",
    description: "Step-by-step operational protocols aligned with institutional standards.",
  },
  {
    title: "Compliance Checkpoints",
    description: "Required compliance checkpoints for institutional activities.",
  },
  {
    title: "Execution Records",
    description: "Documentation and records of completed institutional execution steps.",
  },
];

export default async function ExecutionFrameworkPage() {
  return (
    <ExecutiveRouteGuard pathname="/executive/execution-framework">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Execution Framework"
            title="Operational standards"
            description="Frameworks and protocols governing institutional execution and fiduciary compliance."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {frameworkSections.map((section) => (
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
