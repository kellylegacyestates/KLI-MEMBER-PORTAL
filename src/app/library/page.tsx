import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Library",
};

export default async function LibraryPage() {
  await MemberRouteGuard({ children: null, pathname: "/library" });
  redirect("/research-library");
}
