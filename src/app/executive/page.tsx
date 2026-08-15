import type { Metadata } from "next";
import Link from "next/link";
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
    href: "/executive/execution-framework",
  },
  {
    title: "Institutional Governance",
    description: "Governance records, policy instruments, and institutional oversight documentation.",
    href: "/executive/institutional-governance",
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
              >
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
    </ExecutiveRouteGuard>
  );
}
