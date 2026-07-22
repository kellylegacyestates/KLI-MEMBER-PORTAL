export function InstitutionalFooter() {
  return (
    <footer className="border-t border-[#d8d0bc] bg-[#001f3f] text-[#f5f1de]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">
            Kelly Legacy Institute
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Member Portal</h2>
          <p className="mt-3 text-sm leading-7 text-[#e8e2cf]">
            Supporting institutional members through trusted education, research access, and professional stewardship.
          </p>
        </div>

        <div className="grid gap-6 text-sm text-[#e8e2cf] sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white">Member Services</h3>
            <p className="mt-2 leading-7">Curriculum support, billing assistance, and account guidance for active members.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <p className="mt-2 leading-7">Email: members@kellylegacyinstitute.org</p>
            <p className="leading-7">Office hours: Monday–Friday, 8:00–18:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
