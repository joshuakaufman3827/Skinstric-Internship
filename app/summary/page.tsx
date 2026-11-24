"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DiamondButton from "@/components/DiamondButton";
import type { Demographics } from "@/lib/api";
import { Selections, storage } from "@/lib/storage";

type Category = "race" | "age" | "gender";
const CATEGORIES: Category[] = ["race", "age", "gender"];
const CATEGORY_LABEL: Record<Category, string> = { race: "Race", age: "Age", gender: "Sex" };

/** 0.25258 → "25.26" (2 decimal places, as the brief requires) */
const pctNum = (v: number) => (v * 100).toFixed(2);

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** Highest score first */
const sortScores = (scores: Record<string, number>) =>
  Object.entries(scores).sort((a, b) => b[1] - a[1]);

/** Small rotated-square arrow used beside the DEMOGRAPHICS title (frame 014). */
function MiniArrow({ dir, onClick, label }: { dir: "left" | "right"; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-[22px] w-[22px] rotate-45 items-center justify-center border border-ink transition-transform hover:scale-110"
    >
      <svg width="6" height="7" viewBox="0 0 8 9" style={{ transform: `rotate(${dir === "left" ? 135 : -45}deg)` }} fill="currentColor" aria-hidden>
        <path d="M0 0L8 4.5L0 9V0Z" />
      </svg>
    </button>
  );
}

/** Figma frames 013 (race) and 014 (age): sidebar / result panel / confidence list. */
export default function SummaryPage() {
  const router = useRouter();
  const [data, setData] = useState<Demographics | null>(null);
  const [selected, setSelected] = useState<Selections>({});
  const [active, setActive] = useState<Category>("race");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const d = storage.getDemographics();
    if (!d) {
      router.replace("/result");
      return;
    }
    setData(d);
    setSelected(storage.getSelections());
  }, [router]);

  const sorted = useMemo(
    () =>
      data && {
        race: sortScores(data.race),
        age: sortScores(data.age),
        gender: sortScores(data.gender),
      },
    [data]
  );

  if (!data || !sorted) return null;

  // Actual value = the user's correction, otherwise the AI's top prediction
  const valueFor = (c: Category) => selected[c] ?? sorted[c][0][0];
  const scoreFor = (c: Category) => data[c][valueFor(c)] ?? 0;

  function choose(key: string) {
    setSelected((s) => ({ ...s, [active]: key }));
    setSaved(false);
  }

  function step(dir: 1 | -1) {
    const i = CATEGORIES.indexOf(active);
    setActive(CATEGORIES[(i + dir + CATEGORIES.length) % CATEGORIES.length]);
  }

  function reset() {
    setSelected({});
    storage.setSelections({});
    setSaved(false);
  }

  function confirm() {
    storage.setSelections(selected);
    setSaved(true);
  }

  const activeValue = valueFor(active);
  const activeScore = scoreFor(active);
  const R = 49.5;
  const C = 2 * Math.PI * R;

  return (
    <main className="flex min-h-dvh flex-col xl:h-dvh xl:overflow-hidden">
      <Header section="ANALYSIS" />

      <div className="px-4 pt-[22px] sm:px-8">
        <p className="text-base font-semibold uppercase leading-6">A. I. Analysis</p>
        <div className="mt-1 flex items-center gap-6">
          <h1 className="text-[clamp(2.5rem,3.75vw,4.5rem)] font-light uppercase leading-[0.9] tracking-[-0.06em]">
            Demographics
          </h1>
          <div className="hidden items-center gap-4 sm:flex">
            <MiniArrow dir="left" onClick={() => step(-1)} label="Previous category" />
            <MiniArrow dir="right" onClick={() => step(1)} label="Next category" />
          </div>
        </div>
        <p className="mt-[11px] text-sm uppercase leading-6">Predicted race &amp; age</p>
      </div>

      {/* 208 / 1168 / 448 columns with 16px gaps at 1920 wide */}
      {/* xl (1280px+): fills the space left on screen (min-h-0 lets it shrink) so the page fits like the Figma */}
      <section className="grid flex-1 gap-4 px-4 pb-4 pt-6 sm:px-8 md:grid-cols-[1fr_3fr] xl:grid-cols-[208fr_1168fr_448fr] md:pt-[clamp(16px,5vh,90px)] xl:min-h-0">
        {/* Left: the user's actual attributes — click to show that category */}
        <div className="grid grid-cols-3 gap-2 md:flex md:flex-col">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`flex h-[104px] flex-col justify-between border-t border-ink px-2 pb-[13px] pt-[11px] text-left text-sm font-semibold uppercase leading-6 transition-colors sm:px-4 sm:text-base ${
                active === c ? "bg-ink text-white" : "bg-panel hover:bg-panel-hover"
              }`}
            >
              <span className="text-xs leading-4 sm:text-base sm:leading-6">{valueFor(c)}</span>
              <span>{CATEGORY_LABEL[c]}</span>
            </button>
          ))}
        </div>

        {/* Center: selected value + confidence ring */}
        <div className="relative flex min-h-[340px] flex-col border-t border-ink bg-panel p-4 xl:min-h-0">
          <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-10 tracking-[-0.04em]">
            {titleCase(activeValue)}
            {active === "age" && " y.o."}
          </p>
          <div className="flex flex-1 items-end justify-center md:justify-end">
            {/* Figma ring: 384px on a 960px-tall frame = 40vh; never larger than 384px or 20vw */}
            <div className="relative aspect-square w-[240px] sm:w-[300px] xl:w-[min(384px,40vh,20vw)]">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r={R} fill="none" stroke="#c1c2c3" strokeWidth="0.6" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="#1a1b1c"
                  strokeWidth="0.6"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - activeScore)}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-10 tracking-[-0.04em]">
                {pctNum(activeScore)}
                <sup className="ml-0.5 text-base">%</sup>
              </span>
            </div>
          </div>
        </div>

        {/* Right: AI confidence, highest first — click a row to correct it */}
        {/* tablet: full-width row under the other two; desktop: its own column */}
        <div className="border-t border-ink bg-panel pb-4 md:col-span-2 xl:col-span-1 xl:min-h-0 xl:overflow-y-auto">
          <div className="flex justify-between gap-4 px-4 py-[14px] text-sm font-medium uppercase leading-6 sm:text-base">
            <span>{CATEGORY_LABEL[active]}</span>
            <span>A. I. Confidence</span>
          </div>
          <ul>
            {sorted[active].map(([key, score]) => {
              const isSel = key === activeValue;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => choose(key)}
                    aria-pressed={isSel}
                    className={`flex h-12 w-full items-center justify-between px-4 xl:h-[clamp(36px,5vh,48px)] text-sm leading-6 transition-colors sm:text-base ${
                      isSel ? "bg-ink text-white" : "hover:bg-panel-hover"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`relative inline-flex h-3 w-3 rotate-45 items-center justify-center border ${
                          isSel ? "border-white" : "border-ink"
                        }`}
                      >
                        {isSel && <span className="h-1.5 w-1.5 bg-white" />}
                      </span>
                      {titleCase(key)}
                    </span>
                    <span>{pctNum(score)} %</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <footer className="flex flex-col-reverse items-center justify-between gap-6 px-4 pb-8 pt-2 sm:flex-row sm:px-8">
        <DiamondButton label="BACK" direction="left" href="/select" />
        <p className="hidden text-sm leading-6 text-mute lg:block">If A.I. estimate is wrong, select the correct one.</p>
        <div className="flex items-center gap-4">
          {saved && <span className="fade-up text-sm text-ink/60">Saved</span>}
          <button
            type="button"
            onClick={reset}
            className="h-9 border border-ink px-4 text-sm font-semibold uppercase hover:bg-panel"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={confirm}
            className="h-9 bg-ink px-4 text-sm font-semibold uppercase text-white hover:opacity-80"
          >
            Confirm
          </button>
        </div>
      </footer>
    </main>
  );
}
