"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase/client";
import { updateUserProfile, type ResolvedUserProfile } from "@/lib/firebase/userProfile";

type SaveState = "idle" | "saving" | "saved" | "error";

// Receives a guaranteed non-null profile so useState can be initialised with
// real values on first mount rather than empty strings.
function ProfileForm({
  profile,
  refreshProfile,
}: {
  profile: ResolvedUserProfile;
  refreshProfile: () => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [institution, setInstitution] = useState(profile.institution);
  const [membershipPurpose, setMembershipPurpose] = useState(profile.membershipPurpose);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const createdAtDisplay = profile.createdAt
    ? profile.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const statusLabel: Record<string, string> = {
    active: "Active",
    pending: "Pending approval",
    suspended: "Suspended",
  };

  const roleLabel: Record<string, string> = {
    member: "Member",
    instructor: "Instructor",
    admin: "Administrator",
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!db) return;

    setSaveState("saving");
    setErrorMessage("");
    try {
      await updateUserProfile(db, profile.uid, {
        displayName: displayName.trim(),
        institution: institution.trim(),
        membershipPurpose: membershipPurpose.trim(),
      });
      await refreshProfile();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch {
      setErrorMessage("Your changes could not be saved. Please try again.");
      setSaveState("error");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#d8d0bc] bg-white px-3.5 py-2.5 text-sm text-[#001f3f] shadow-sm focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30";
  const readonlyInputClass =
    "w-full rounded-lg border border-[#d8d0bc] bg-[#f8f6ee] px-3.5 py-2.5 text-sm text-[#243449] cursor-default select-none";
  const labelClass = "block text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#243449]";
  const hintClass = "mt-1 text-[0.68rem] text-[#6b7280]";

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Editable section */}
      <div className="rounded-2xl border border-[#d8d0bc] bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
          Personal details
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
              maxLength={120}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="institution">
              Institution
            </label>
            <input
              id="institution"
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
              maxLength={200}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="membershipPurpose">
              Membership purpose
            </label>
            <textarea
              id="membershipPurpose"
              value={membershipPurpose}
              onChange={(e) => setMembershipPurpose(e.target.value)}
              className={`mt-1.5 ${inputClass} min-h-[96px] resize-y`}
              maxLength={600}
            />
          </div>
        </div>
      </div>

      {/* Read-only section */}
      <div className="rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] p-6 shadow-sm">
        <h3 className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#6b7280]">
          Account record
        </h3>
        <p className={`mb-5 ${hintClass}`}>
          These fields are managed by the institution and cannot be edited here.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Email address</label>
            <div className={`mt-1.5 ${readonlyInputClass}`}>{profile.email}</div>
          </div>
          <div>
            <label className={labelClass}>Membership status</label>
            <div className={`mt-1.5 ${readonlyInputClass}`}>
              {statusLabel[profile.membershipStatus] ?? profile.membershipStatus}
            </div>
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <div className={`mt-1.5 ${readonlyInputClass}`}>
              {roleLabel[profile.role] ?? profile.role}
            </div>
          </div>
          <div>
            <label className={labelClass}>Member since</label>
            <div className={`mt-1.5 ${readonlyInputClass}`}>{createdAtDisplay}</div>
          </div>
        </div>
      </div>

      {/* Save controls */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saveState === "saving"}
          className="rounded-lg bg-[#001f3f] px-5 py-2.5 text-sm font-semibold text-[#f5f1de] shadow-sm transition hover:bg-[#002d5a] disabled:opacity-60"
        >
          {saveState === "saving" ? "Saving…" : "Save changes"}
        </button>
        {saveState === "saved" && (
          <span className="text-sm font-medium text-[#2e7d32]">Changes saved.</span>
        )}
        {saveState === "error" && (
          <span className="text-sm font-medium text-[#c62828]">{errorMessage}</span>
        )}
      </div>
    </form>
  );
}

function ProfilePageContent() {
  const { profile, refreshProfile } = useAuth();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Account"
        title="Member profile"
        description="View your institutional record and update permitted personal details."
      />
      {profile ? (
        // Keyed on uid so the form remounts (and useState re-initialises) if
        // the authenticated user changes.
        <ProfileForm key={profile.uid} profile={profile} refreshProfile={refreshProfile} />
      ) : (
        <div className="flex min-h-[240px] items-center justify-center text-sm text-[#243449]">
          Loading your profile…
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProfilePageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
