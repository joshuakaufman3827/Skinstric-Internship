import Link from "next/link";

export default function Header({
  section = "INTRO",
  showCode = false,
  light = false,
}: {
  section?: string;
  showCode?: boolean;
  /** white text, for the live camera screen */
  light?: boolean;
}) {
  return (
    <header
      className={`relative z-20 flex h-16 items-center justify-between px-4 sm:px-8 ${
        light ? "text-white" : "text-ink"
      }`}
    >
      <div className="flex items-center gap-4 text-sm font-semibold leading-4 tracking-tight">
        <Link href="/" className="hover:opacity-70">
          SKINSTRIC
        </Link>
        <span
          className={`flex items-center gap-1 ${
            light ? "text-white/70" : "text-ink/60"
          }`}
        >
          <span className="text-lg font-light">[</span>
          <span className="text-xs">{section}</span>
          <span className="text-lg font-light">]</span>
        </span>
      </div>
      {showCode && (
        <button
          type="button"
          className="bg-ink px-4 py-2 text-[10px] font-semibold text-white hover:opacity-80"
        >
          ENTER CODE
        </button>
      )}
    </header>
  );
}
