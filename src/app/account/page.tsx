import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Account",
};

function AccountRedirect() {
  redirect("/profile");
  return null;
}

export default function AccountPage() {
  return (
    <MemberRouteGuard pathname="/account">
      <AccountRedirect />
    </MemberRouteGuard>
  );
}
