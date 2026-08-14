import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recover Access",
  description: "Recover access to the Kelly Legacy Institute member portal.",
};

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Account Recovery</p>

        <h1 className="mt-3 text-3xl font-semibold text-[#001f3f] sm:text-4xl">
          Recover your institutional access
        </h1>

        <p className="mt-4 text-base leading-8 text-[#243449]">
          Enter the email address associated with your member account and we will send the next set of access instructions.
        </p>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </section>
    </PublicLayout>
  );
}
