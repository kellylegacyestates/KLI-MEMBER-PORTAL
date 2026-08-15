import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Library",
};

function LibraryRedirect() {
  redirect("/research-library");
  return null;
}

export default function LibraryPage() {
  return (
    <MemberRouteGuard pathname="/library">
      <LibraryRedirect />
    </MemberRouteGuard>
  );
}
