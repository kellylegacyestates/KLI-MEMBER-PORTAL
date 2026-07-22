type InstitutionalHeaderProps = {
  onMenuToggle: () => void;
};

export function InstitutionalHeader({ onMenuToggle }: InstitutionalHeaderProps) {
  return (
    <header className="border-b border-[#d8d0bc] bg-[#001f3f] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37] bg-[#d4af37]/10 text-sm font-semibold tracking-[0.2em] text-[#f5f1de]">
            KLI
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">
              Kelly Legacy Institute
            </p>
            <h1 className="text-lg font-semibold text-[#f5f1de]">Member Portal</h1>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-[#f5f1de]">
            Institutional Access
          </div>
          <div className="rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#001f3f]">
            Member Services
          </div>
        </div>

        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-[#f5f1de] lg:hidden"
          aria-label="Open navigation"
        >
          <span>Menu</span>
          <span className="text-base">☰</span>
        </button>
      </div>
    </header>
  );
}
