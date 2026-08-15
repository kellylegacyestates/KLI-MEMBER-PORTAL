import { redirect } from "next/navigation";
import {
  requireActiveMember,
  requireExecutive,
  requireAdmin,
  type AdminAuthorizationResult,
  type ExecutiveAuthorizationResult,
  type MemberAuthorizationResult,
} from "@/lib/auth/server";
import type { ResolvedUserProfile } from "@/lib/firebase/userProfile";

function redirectToLogin(pathname: string): never {
  redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
}

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

function AccessCard({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-sm font-semibold text-[#001f3f]">{title}</p>
      <p className="max-w-sm text-sm text-[#243449]">{message}</p>
      {action}
    </div>
  );
}

function ContactSupportLink() {
  return (
    <a
      href="/support"
      className="rounded-full bg-[#001f3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#002f5f]"
    >
      Contact support
    </a>
  );
}

function LoginLink() {
  return (
    <a
      href="/login"
      className="rounded-full bg-[#001f3f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#002f5f]"
    >
      Sign in
    </a>
  );
}

// ---------------------------------------------------------------------------
// UX state panels for each access condition
// ---------------------------------------------------------------------------

function renderMemberDenied(
  result: Exclude<MemberAuthorizationResult, { kind: "authorized" | "unauthenticated" }>
) {
  if (result.kind === "missing-profile") {
    return (
      <AccessCard
        title="Profile unavailable"
        message="Your member profile could not be verified. Please contact support for assistance."
        action={<ContactSupportLink />}
      />
    );
  }

  if (result.kind === "inactive-account") {
    const profile: ResolvedUserProfile = result.profile;

    if (profile.accountStatus === "revoked") {
      return (
        <AccessCard
          title="Account revoked"
          message="Your account access has been permanently revoked. Please contact support if you believe this is an error."
          action={<ContactSupportLink />}
        />
      );
    }

    return (
      <AccessCard
        title="Account suspended"
        message="Your account is not eligible for protected access. Please contact support to resolve this matter."
        action={<ContactSupportLink />}
      />
    );
  }

  if (result.kind === "inactive-membership") {
    const profile: ResolvedUserProfile = result.profile;

    if (profile.membershipStatus === "pending") {
      return (
        <AccessCard
          title="Membership pending"
          message="Your application is under review. You will receive confirmation once your membership is approved. No action is needed at this time."
          action={<ContactSupportLink />}
        />
      );
    }

    if (profile.membershipStatus === "suspended") {
      return (
        <AccessCard
          title="Membership suspended"
          message="Your membership has been temporarily suspended. Please contact support to resolve this matter."
          action={<ContactSupportLink />}
        />
      );
    }

    if (profile.membershipStatus === "expired") {
      return (
        <AccessCard
          title="Membership expired"
          message="Your membership term has lapsed. Please renew your membership to restore access."
          action={<ContactSupportLink />}
        />
      );
    }

    if (profile.membershipStatus === "revoked") {
      return (
        <AccessCard
          title="Access revoked"
          message="Your membership access has been permanently revoked. Please contact support if you believe this is an error."
          action={<ContactSupportLink />}
        />
      );
    }

    return (
      <AccessCard
        title="Administrator access unavailable"
        message="Administrator access could not be verified. Please contact support for assistance."
        action={<ContactSupportLink />}
      />
    );
  }

  return (
    <AccessCard
      title="Membership access unavailable"
      message="Your account exists, but protected member access is unavailable until your membership is active."
      action={<ContactSupportLink />}
    />
  );
}

function renderExecutiveDenied(
  result: Exclude<ExecutiveAuthorizationResult, { kind: "authorized" | "unauthenticated" }>
) {
  if (result.kind === "forbidden") {
    return (
      <AccessCard
        title="Executive access required"
        message="This area is restricted to executive and administrative accounts. Your current role does not permit access to this section."
        action={<ContactSupportLink />}
      />
    );
  }

  return renderMemberDenied(result);
}

function renderAdminDenied(
  result: Exclude<AdminAuthorizationResult, { kind: "authorized" | "unauthenticated" }>
) {
  if (result.kind === "missing-profile") {
    return (
      <AccessCard
        title="Profile unavailable"
        message="Your administrator profile could not be verified. Please contact support for assistance."
        action={<ContactSupportLink />}
      />
    );
  }

  if (result.kind === "inactive-account") {
    const profile: ResolvedUserProfile = result.profile;

    if (profile.accountStatus === "revoked") {
      return (
        <AccessCard
          title="Account revoked"
          message="Your administrator account access has been permanently revoked. Please contact support if you believe this is an error."
          action={<ContactSupportLink />}
        />
      );
    }

    return (
      <AccessCard
        title="Account suspended"
        message="Your administrator account is not eligible for protected access. Please contact support to resolve this matter."
        action={<ContactSupportLink />}
      />
    );
  }

  if (result.kind === "forbidden") {
    return (
      <AccessCard
        title="Administrator access required"
        message="This area is restricted to administrator accounts. Your current role does not permit access to this section."
        action={<ContactSupportLink />}
      />
    );
  }
}

// ---------------------------------------------------------------------------
// Route guard components
// ---------------------------------------------------------------------------

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
    return renderMemberDenied(result);
  }

  return <>{children}</>;
}

export async function ExecutiveRouteGuard({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const result = await requireExecutive();

  if (result.kind === "unauthenticated") {
    redirectToLogin(pathname);
  }

  if (result.kind !== "authorized") {
    return renderExecutiveDenied(result);
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
    return renderAdminDenied(result);
  }

  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// Standalone access-state pages (used by /access-denied and /verify-email)
// ---------------------------------------------------------------------------

export function EmailVerificationRequiredView() {
  return (
    <AccessCard
      title="Email verification required"
      message="Please verify your email address before accessing the portal. Check your inbox for a verification link."
      action={<LoginLink />}
    />
  );
}

export function SessionExpiredView() {
  return (
    <AccessCard
      title="Session expired"
      message="Your session has expired. Please sign in again to continue."
      action={<LoginLink />}
    />
  );
}

export function ServiceUnavailableView() {
  return (
    <AccessCard
      title="Authentication service unavailable"
      message="The authentication service is temporarily unavailable. Please try again in a moment."
      action={<LoginLink />}
    />
  );
}
