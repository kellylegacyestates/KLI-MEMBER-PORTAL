import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  await MemberRouteGuard({ children: null, pathname: "/account" });
  redirect("/profile");
}
