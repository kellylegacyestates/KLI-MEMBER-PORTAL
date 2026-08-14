import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MemberProfileCard } from "@/components/features/profile/MemberProfileCard";

export const metadata: Metadata = {
  title: "Account",
  description: "Member profile and account settings for Kelly Legacy Institute.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Account"
            title="Member profile"
            description="Review and update your institutional identity, contact details, and professional interests."
          />
          <MemberProfileCard />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
