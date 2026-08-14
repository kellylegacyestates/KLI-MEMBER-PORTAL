"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { db } from "@/lib/firebase/client";
import { updateUserProfile } from "@/lib/firebase/userProfile";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function membershipTone(status: string | null): "navy" | "gold" | "ivory" {
  if (status === "active") return "navy";
  if (status === "pending") return "gold";
  return "ivory";
}

function roleTone(role: string | null): "navy" | "gold" | "ivory" {
  if (role === "admin") return "navy";
  if (role === "instructor") return "gold";
  return "ivory";
}

// ---------------------------------------------------------------------------
// Field row — read and edit mode
// ---------------------------------------------------------------------------

type FieldRowProps = {
  label: string;
  value: string;
  editing: boolean;
  inputId: string;
  multiline?: boolean;
  onChange: (v: string) => void;
};

function FieldRow({ label, value, editing, inputId, multiline, onChange }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-6">
      <dt className="w-48 shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
        {label}
      </dt>
      <dd className="flex-1">
        {editing ? (
          multiline ? (
            <textarea
              id={inputId}
              rows={3}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-xl border border-[#d8d0bc] bg-[#f8f6ee] px-3 py-2 text-sm text-[#0f172a] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
            />
          ) : (
            <input
              id={inputId}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-xl border border-[#d8d0bc] bg-[#f8f6ee] px-3 py-2 text-sm text-[#0f172a] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
            />
          )
        ) : (
          <span className="text-sm leading-7 text-[#243449]">{value || <em className="opacity-50">Not provided</em>}</span>
        )}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MemberProfileCard() {
  const { user, profile, loading, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local editable state, initialised from the resolved profile.
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [institution, setInstitution] = useState(profile?.institution ?? "");
  const [membershipPurpose, setMembershipPurpose] = useState(profile?.membershipPurpose ?? "");

  // Keep local state in sync when profile is first loaded.
  const [initialised, setInitialised] = useState(false);
  if (profile && !initialised) {
    setDisplayName(profile.displayName);
    setInstitution(profile.institution);
    setMembershipPurpose(profile.membershipPurpose);
    setInitialised(true);
  }

  if (loading) {
    return <LoadingState message="Loading your member profile…" />;
  }

  if (!profile || !user) {
    return (
      <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 text-sm text-[#243449]">
        Your profile could not be loaded. Please refresh or contact support.
      </div>
    );
  }

  async function handleSave() {
    if (!db || !user) return;
    setSaving(true);
    setError(null);
    try {
      await updateUserProfile(db, user.uid, { displayName, institution, membershipPurpose });
      await refreshProfile();
      setEditing(false);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    // Reset to committed values.
    setDisplayName(profile?.displayName ?? "");
    setInstitution(profile?.institution ?? "");
    setMembershipPurpose(profile?.membershipPurpose ?? "");
    setError(null);
    setEditing(false);
  }

  const joinDate = profile.createdAt
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(profile.createdAt)
    : "—";

  return (
    <div className="space-y-6">
      {/* Identity summary */}
      <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#001f3f] p-6 text-[#f5f1de] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
              Kelly Legacy Institute
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {profile.displayName || "Member"}
            </h2>
            <p className="mt-1 text-sm text-[#c5bfa8]">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              label={profile.membershipStatus ?? "Unknown"}
              tone={membershipTone(profile.membershipStatus)}
            />
            <StatusBadge
              label={profile.role ?? "member"}
              tone={roleTone(profile.role)}
            />
          </div>
        </div>
        <div className="mt-4 border-t border-[#f5f1de]/20 pt-4 text-[0.75rem] text-[#c5bfa8]">
          Member since {joinDate}
        </div>
      </div>

      {/* Editable details */}
      <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-[#001f3f]">Profile details</h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="rounded-full border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#001f3f] transition hover:bg-[#f5f1de] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            >
              Edit
            </button>
          )}
        </div>

        <dl className="mt-6 space-y-5">
          <FieldRow
            label="Full name"
            value={displayName}
            editing={editing}
            inputId="displayName"
            onChange={setDisplayName}
          />
          <FieldRow
            label="Email"
            value={user.email ?? ""}
            editing={false}
            inputId="email"
            onChange={() => {}}
          />
          <FieldRow
            label="Institution"
            value={institution}
            editing={editing}
            inputId="institution"
            onChange={setInstitution}
          />
          <FieldRow
            label="Membership purpose"
            value={membershipPurpose}
            editing={editing}
            inputId="membershipPurpose"
            multiline
            onChange={setMembershipPurpose}
          />
          <FieldRow
            label="Role"
            value={profile.role ?? "member"}
            editing={false}
            inputId="role"
            onChange={() => {}}
          />
          <FieldRow
            label="Membership status"
            value={profile.membershipStatus ?? "pending"}
            editing={false}
            inputId="membershipStatus"
            onChange={() => {}}
          />
        </dl>

        {editing && (
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-[#001f3f] px-6 py-2 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#003366] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-full border border-[#d8d0bc] px-6 py-2 text-sm font-semibold text-[#243449] transition hover:bg-[#f8f6ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] disabled:opacity-50"
            >
              Cancel
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
