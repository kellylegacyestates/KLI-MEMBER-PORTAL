import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { MemberDashboard } from "@/components/features/dashboard/MemberDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Member dashboard for Kelly Legacy Institute.",
};

export default function MemberDashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <MemberDashboard />
      </AppShell>
    </ProtectedRoute>
  );
}
