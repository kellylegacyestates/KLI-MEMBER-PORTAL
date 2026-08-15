import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Access Denied",
  description: "You do not have permission to access this resource.",
};

export default function AccessDeniedPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-sm font-semibold text-[#001f3f]">Access denied</p>
        <p className="max-w-sm text-sm text-[#243449]">
          You do not have permission to view this page. If you believe this is an error,
          please contact support.
        </p>
        <div className="flex gap-3">
          <a
            href="/dashboard"
            className="rounded-full bg-[#001f3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#002f5f]"
          >
            Go to dashboard
          </a>
          <a
            href="/support"
            className="rounded-full border border-[#d8d0bc] bg-white px-4 py-2 text-sm font-medium text-[#001f3f] transition hover:bg-[#f5f1de]"
          >
            Contact support
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
