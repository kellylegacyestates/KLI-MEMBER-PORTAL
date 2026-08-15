import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { EmailVerificationRequiredView } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Email verification required for Kelly Legacy Institute member portal.",
};

export default function VerifyEmailPage() {
  return (
    <PublicLayout>
      <EmailVerificationRequiredView />
    </PublicLayout>
  );
}
