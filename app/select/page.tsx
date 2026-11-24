"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DiamondButton from "@/components/DiamondButton";
import DiamondRings from "@/components/DiamondRings";
import { storage } from "@/lib/storage";

const tiles = [
  { label: "Demographics", href: "/summary", cell: "col-start-1 row-start-1" },
  { label: "Cosmetic concerns", cell: "col-start-2 row-start-1" },
  { label: "Skin type details", cell: "col-start-1 row-start-2" },
  { label: "Weather", cell: "col-start-2 row-start-2" },
] as const;

/** Figma frame 012: four rhombus tiles; only Demographics is active. */
export default function SelectPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // No scan yet → send them back to take one
  useEffect(() => {
    if (!storage.getDemographics()) router.replace("/result");
  }, [router]);

  return (
    <main className="relative flex h-dvh min-h-[640px] flex-col overflow-hidden">
      <Header section="ANALYSIS" />
      <div className="px-4 pt-[22px] sm:px-8">
        <h2 className="text-base font-semibold uppercase leading-6">A. I. Analysis</h2>
        <p className="mt-2 max-w-[336px] text-sm uppercase leading-6">
          A. I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      <section className="relative flex flex-1 items-center justify-center">
        <DiamondRings className={`transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-60"}`} />

        {/* 2×2 grid rotated 45° → a rhombus made of four rhombuses (154px squares, 6px gap) */}
        <div className="relative z-10 grid rotate-45 grid-cols-2 grid-rows-2 gap-[6px]">
          {tiles.map((t) => {
            const inner = (
              <span className="-rotate-45 px-1 text-center text-[clamp(10px,0.83vw,16px)] font-semibold uppercase leading-[1.4]">
                {t.label}
              </span>
            );
            // Figma tile: 154px square at 1920 wide = 8.02vw. Scale with the screen like the rings do.
            const size = "flex h-[clamp(80px,8.02vw,154px)] w-[clamp(80px,8.02vw,154px)] items-center justify-center";
            return "href" in t ? (
              <Link
                key={t.label}
                href={t.href}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`${size} ${t.cell} bg-panel-hover transition-colors duration-200 hover:bg-panel-active`}
              >
                {inner}
              </Link>
            ) : (
              <div key={t.label} className={`${size} ${t.cell} cursor-not-allowed bg-panel`} aria-disabled>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 flex h-[124px] items-center justify-between px-4 pb-4 sm:px-8">
        <DiamondButton label="BACK" direction="left" href="/result" />
        <DiamondButton label="GET SUMMARY" direction="right" href="/summary" />
      </footer>
    </main>
  );
}
