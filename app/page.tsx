"use client";

import { useState } from "react";
import Header from "@/components/Header";
import DiamondButton from "@/components/DiamondButton";

/** Figma frames 000 (default) and 001 (hover on TAKE TEST). */
export default function Home() {
  const [hover, setHover] = useState<"left" | "right" | null>(null);

  return (
    <main className="relative flex h-dvh min-h-[600px] flex-col overflow-hidden">
      <Header showCode />

      {/* Side rhombuses: 602px squares, half off screen (desktop) */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={`absolute top-1/2 hidden -translate-y-1/2 transition-opacity duration-500 lg:block ${
            side === "left" ? "left-0" : "right-0"
          } ${hover && hover !== side ? "opacity-0" : "opacity-100"}`}
          onMouseEnter={() => setHover(side)}
          onMouseLeave={() => setHover(null)}
        >
          <div className="relative flex h-[602px] w-[301px] items-center overflow-hidden">
            <div
              className={`absolute top-[89px] h-[425px] w-[425px] rotate-45 border border-dotted border-mute ${
                side === "left" ? "-left-[213px]" : "-right-[213px]"
              }`}
            />
            {/* extra outlines appear on hover (frame 001) */}
            <div
              className={`absolute top-[59px] h-[484px] w-[484px] rotate-45 border border-dotted border-mute transition-opacity duration-500 ${
                side === "left" ? "-left-[242px]" : "-right-[242px]"
              } ${hover === side ? "opacity-60" : "opacity-0"}`}
            />
            <div className={`relative ${side === "left" ? "ml-8" : "ml-auto mr-8"}`}>
              <DiamondButton
                label={side === "left" ? "DISCOVER A.I." : "TAKE TEST"}
                direction={side}
                href="/testing"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Title — slides away from the hovered side */}
      <section className="relative flex flex-1 items-center justify-center px-6">
        {/* Mobile / tablet backdrop rhombuses */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center lg:hidden" aria-hidden>
          <div className="absolute aspect-square w-[min(420px,72vw)] rotate-45 border border-dotted border-mute" />
          <div className="absolute aspect-square w-[min(500px,86vw)] rotate-45 border border-dotted border-mute opacity-50" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center lg:block">
          <h1
            className={`text-center text-[clamp(3rem,10vw,8rem)] font-light leading-[0.94] tracking-[-0.07em] transition-all duration-700 ease-in-out lg:mx-auto lg:w-[680px] ${
              hover === "right"
                ? "lg:-translate-x-[calc(50vw_-_340px_-_32px)] lg:text-left"
                : hover === "left"
                ? "lg:translate-x-[calc(50vw_-_340px_-_32px)] lg:text-right"
                : ""
            }`}
          >
            Sophisticated
            <br />
            skincare
          </h1>

          <p className="mt-6 max-w-[316px] text-center text-sm font-semibold uppercase leading-6 text-ink/80 lg:hidden">
            Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your skin needs.
          </p>
          <div className="mt-8 lg:hidden">
            <DiamondButton label="ENTER EXPERIENCE" direction="right" href="/testing" />
          </div>
        </div>
      </section>

      <p className="absolute bottom-[26px] left-8 hidden w-[316px] text-sm font-normal uppercase leading-6 lg:block">
        Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your skin needs.
      </p>
    </main>
  );
}
