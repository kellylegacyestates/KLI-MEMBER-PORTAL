"use client";

import { useState } from "react";

export function SessionRevocationForm() {
  const [targetUid, setTargetUid] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) return;

    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/users/revoke-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ targetUid, reason }),
      });

      if (!response.ok) {
        setMessage("Sessions could not be revoked. Verify the user ID and try again.");
        return;
      }

      setMessage("All sessions for this user have been revoked.");
      setTargetUid("");
      setReason("");
      setConfirmed(false);
    } catch {
      setMessage("Sessions could not be revoked. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-[#001f3f]">Immediate session revocation</h2>
      <p className="mt-2 text-sm text-[#243449]">
        Force a member to re-authenticate on every device. This action is recorded in the audit log.
      </p>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-medium text-[#001f3f]">
          Firebase user ID
          <input
            value={targetUid}
            onChange={(event) => setTargetUid(event.target.value)}
            maxLength={128}
            required
            className="mt-2 w-full rounded-xl border border-[#d8d0bc] px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-[#001f3f]">
          Reason
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            minLength={10}
            maxLength={500}
            required
            rows={3}
            className="mt-2 w-full rounded-xl border border-[#d8d0bc] px-3 py-2"
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-[#243449]">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-1"
          />
          I understand that this immediately signs the member out of all devices.
        </label>
        <button
          type="submit"
          disabled={submitting || !confirmed}
          className="rounded-full bg-[#7a2b1d] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Revoking…" : "Revoke all sessions"}
        </button>
        {message ? <p role="status" className="text-sm text-[#243449]">{message}</p> : null}
      </div>
    </form>
  );
}
