import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Trump v. California | Federal Authority Alert",
  description:
    "KLI analysis of the Supreme Court's August 24, 2026 stay decision addressing standing, ripeness, rulemaking stages, and judicial review.",
};

export default async function TrumpVCaliforniaBriefingPage() {
  return (
    <MemberRouteGuard pathname="/briefings/trump-v-california">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Federal Authority Alert"
            title="Trump v. California"
            description="Supreme Court authority on standing, ripeness, rulemaking posture, and judicial review."
          />

          <section className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
            <div className="space-y-3 text-sm leading-7 text-[#243449]">
              <p>
                <strong>Authority:</strong> Trump v. California, No. 26A124,
                609 U.S. ___ (Aug. 24, 2026).
              </p>
              <p>
                <strong>Procedural posture:</strong> Emergency stay decision.
                The Court granted the federal government a stay of the district
                court injunction while appellate proceedings continue.
              </p>
              <p>
                <strong>Authority status:</strong> Supreme Court authority —
                interim procedural ruling. This is not a final merits judgment
                on the legality of the underlying executive order or any
                eventual agency rule.
              </p>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#001f3f]">
              What the Court Clarified
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#243449]">
              <p>
                The Court distinguished among an internal executive directive,
                a proposed agency rule, and final agency action.
              </p>
              <p>
                The Court treated anticipated injury based on a chain of future
                regulatory events as too speculative in this posture. The
                relevant contingencies included whether a proposal would issue,
                how comments would be considered, whether a final rule would be
                adopted, what that rule would say, and whether it would cause
                legally cognizable injury.
              </p>
              <p>
                The decision also reinforces that proposed rules remain
                proposals and that agencies ordinarily must consider and respond
                to significant comments before final agency action.
              </p>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#001f3f]">
              KLI Analytical Framework
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#243449]">
              Directive → Agency Process → Proposed Rule → Comment Record →
              Final Agency Action → Injury → Judicial Review
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#001f3f]">
              Curriculum Impact
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[#243449]">
              <p>
                <strong>Module II — Standing:</strong> injury-in-fact,
                imminence, speculative future harm, and anticipatory costs.
              </p>
              <p>
                <strong>APA / Judicial Review:</strong> ripeness, proposed
                rules, final agency action, and reviewability.
              </p>
              <p>
                <strong>KLI-RPS-2026-01:</strong> supports the separation of
                preliminary agency processes from reviewable final action.
              </p>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#001f3f]">
              Teaching Principle
            </h2>
            <div className="mt-4 space-y-2 text-sm leading-7 text-[#243449]">
              <p>Directive is not proposal.</p>
              <p>Proposal is not final action.</p>
              <p>Prediction is not injury.</p>
              <p>Procedure precedes remedy.</p>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#001f3f]">
              Primary Authority
            </h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href="https://www.supremecourt.gov/opinions/25pdf/26a124_hgci.pdf"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#001f3f] underline underline-offset-4"
              >
                Read Supreme Court Opinion
              </a>
              <Link
                href="/briefings"
                className="font-semibold text-[#001f3f] underline underline-offset-4"
              >
                Back to Briefings
              </Link>
            </div>
          </section>

          <p className="text-xs leading-6 text-[#5b6470]">
            Educational research only. Not legal advice.
          </p>
        </div>
      </PortalShell>
    </MemberRouteGuard>
  );
}
