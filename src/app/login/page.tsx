import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Kelly Legacy Institute member portal.",
};

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[#d8d0bc] bg-[#001f3f] p-8 text-[#f5f1de] shadow-sm sm:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Institutional Access</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Sign in to the member portal</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#e8e2cf]">
            Review curriculum, publications, and institutional resources through a secure and carefully structured member experience.
          </p>
        </section>

        <Suspense fallback={<div className="flex items-center justify-center rounded-[2rem] border border-[#d8d0bc] bg-white p-8 sm:p-10 h-[400px]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
