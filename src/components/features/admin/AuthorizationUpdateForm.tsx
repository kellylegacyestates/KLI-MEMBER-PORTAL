"use client";

import { useState } from "react";

export function AuthorizationUpdateForm() {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const update = {
      uid,
      reason,
      ...(role ? { role } : {}),
      ...(accountStatus ? { accountStatus } : {}),
      ...(membershipStatus ? { membershipStatus } : {}),
    };

    try {
      const response = await fetch("/api/admin/users/authorization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(update),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        changed?: boolean;
        sessionsRevoked?: boolean;
      };

      if (!response.ok && response.status !== 207) {
        setMessage({
          tone: "error",
          text: "Authorization could not be updated. Review the values and try again.",
        });
        return;
      }

      if (response.status === 207) {
        setMessage({
          tone: "error",
          text: "Authorization was updated, but active sessions could not be revoked. Follow up immediately.",
        });
        return;
      }

      setMessage({
        tone: "success",
        text: result.changed
          ? `Authorization updated.${result.sessionsRevoked ? " Active sessions were revoked." : ""}`
          : "No authorization values changed.",
      });
      setRole("");
      setAccountStatus("");
      setMembershipStatus("");
      setReason("");
    } catch {
      setMessage({
        tone: "error",
        text: "Authorization could not be updated. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const selectClassName = "mt-2 w-full rounded-xl border border-[#d8d0bc] px-3 py-2";

  return (
    <form
      onSubmit={submit}
      className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-[#001f3f]">Update member authorization</h2>
      <p className="mt-2 text-sm text-[#243449]">
        Change protected role or status values through the audited administrative workflow.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#001f3f] md:col-span-2">
          Firebase user ID
          <input
            value={uid}
            onChange={(event) => setUid(event.target.value)}
            maxLength={128}
            required
            className={selectClassName}
          />
        </label>
        <label className="block text-sm font-medium text-[#001f3f]">
          Role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className={selectClassName}
          >
            <option value="">No change</option>
            <option value="member">Member</option>
            <option value="instructor">Instructor</option>
            <option value="executive">Executive</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-[#001f3f]">
          Account status
          <select
            value={accountStatus}
            onChange={(event) => setAccountStatus(event.target.value)}
            className={selectClassName}
          >
            <option value="">No change</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-[#001f3f] md:col-span-2">
          Membership status
          <select
            value={membershipStatus}
            onChange={(event) => setMembershipStatus(event.target.value)}
            className={selectClassName}
          >
            <option value="">No change</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-[#001f3f] md:col-span-2">
          Reason
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={500}
            required
            rows={3}
            className={selectClassName}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={
          submitting || (!role && !accountStatus && !membershipStatus)
        }
        className="mt-5 rounded-full bg-[#001f3f] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {submitting ? "Updating…" : "Update authorization"}
      </button>
      {message ? (
        <p
          role={message.tone === "error" ? "alert" : "status"}
          className={message.tone === "error" ? "mt-4 text-sm text-red-600" : "mt-4 text-sm text-green-700"}
        >
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
