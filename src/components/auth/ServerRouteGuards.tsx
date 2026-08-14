import { redirect } from "next/navigation";
import {
  requireActiveMember,
  requireAdmin,
  type AdminAuthorizationResult,
  type MemberAuthorizationResult,
} from "@/lib/auth/server";

function redirectToLogin(pathname: string) {
  redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
}

function MemberAccessDenied({ result }: { result: Exclude<MemberAuthorizationResult, { kind: "authorized" | "unauthenticated" }> }) {
  if (result.kind === "missing-profile") {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-[#001f3f]">Access denied</p>
        <p className="max-w-xs text-sm text-[#243449]">
          Your member profile could not be verified. Please contact support for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-semibold text-[#001f3f]">Membership access unavailable</p>
      <p className="max-w-xs text-sm text-[#243449]">
        Your account exists, but protected member access is unavailable until your membership is active.
      </p>
    </div>
  );
}

function AdminAccessDenied({ result }: { result: Exclude<AdminAuthorizationResult, { kind: "authorized" | "unauthenticated" }> }) {
  if (result.kind === "forbidden") {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-[#001f3f]">Access denied</p>
        <p className="max-w-xs text-sm text-[#243449]">
          Your account does not have administrator access to this area.
        </p>
      </div>
    );
  }

  return <MemberAccessDenied result={result} />;
}

export async function MemberRouteGuard({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const result = await requireActiveMember();

  if (result.kind === "unauthenticated") {
    redirectToLogin(pathname);
  }

  if (result.kind !== "authorized") {
    return <MemberAccessDenied result={result} />;
  }

  return <>{children}</>;
}

export async function AdminRouteGuard({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const result = await requireAdmin();

  if (result.kind === "unauthenticated") {
    redirectToLogin(pathname);
  }

  if (result.kind !== "authorized") {
    return <AdminAccessDenied result={result} />;
  }

  return <>{children}</>;
}
