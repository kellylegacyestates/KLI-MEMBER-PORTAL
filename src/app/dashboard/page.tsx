import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { MemberDashboard } from "@/components/features/dashboard/MemberDashboard";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Member dashboard for Kelly Legacy Institute.",
};

export default async function MemberDashboardPage() {
  return (
    <MemberRouteGuard pathname="/dashboard">
      <PortalShell>
          <MemberDashboard />
        </PortalShell>
    </MemberRouteGuard>
  );
}
