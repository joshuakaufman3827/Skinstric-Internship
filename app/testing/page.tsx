"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DiamondButton from "@/components/DiamondButton";
import DiamondRings from "@/components/DiamondRings";
import Loader from "@/components/Loader";
import { submitUserInfo } from "@/lib/api";
import { KEYS, storage } from "@/lib/storage";
import { validateText } from "@/lib/validation";

type Step = "name" | "location" | "submitting" | "done";

/** Figma frames 002 (name), 504 (location), 505 (filled → PROCEED). */
export default function TestingPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Prefill from a previous visit
  useEffect(() => {
    setName(storage.getString(KEYS.name) ?? "");
    setLocation(storage.getString(KEYS.location) ?? "");
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const isName = step === "name";
  const value = isName ? name : location;
  const setValue = isName ? setName : setLocation;
  const label = isName ? "name" : "city";
  const valid = validateText(value, label) === null;

  async function handleSubmit(e?: { preventDefault: () => void }) {
    e?.preventDefault();
    if (step !== "name" && step !== "location") return;

    const msg = validateText(value, label);
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);

    if (step === "name") {
      storage.setString(KEYS.name, name.trim());
      setStep("location");
      return;
    }

    storage.setString(KEYS.location, location.trim());
    setStep("submitting");
    try {
      await submitUserInfo(name.trim(), location.trim());
      setStep("done");
    } catch (err) {
      console.error(err);
      setError("Something went wrong sending your info. Please try again.");
      setStep("location");
    }
  }

  function handleBack() {
    setError(null);
    if (step === "location") setStep("name");
    else if (step === "done") setStep("location");
    else router.push("/");
  }

  // Small label above the input: "CLICK TO TYPE" until something is typed (frame 505)
  const hint = value.trim()
    ? isName
      ? "INTRODUCE YOURSELF"
      : "WHERE ARE YOU FROM?"
    : "CLICK TO TYPE";

  return (
    <main className="relative flex h-dvh min-h-[600px] flex-col overflow-hidden">
      <Header />
      <p className="px-4 pt-[22px] text-base font-semibold uppercase leading-6 sm:px-8">To start analysis</p>

      <section className="relative flex flex-1 items-center justify-center px-6">
        {step === "submitting" ? (
          <Loader text="Processing submission ..." />
        ) : (
          <>
            <DiamondRings />
            <div className="relative z-10 flex w-full max-w-[680px] flex-col items-center text-center">
              {step === "done" ? (
                <div className="fade-up">
                  <p className="text-[clamp(1.75rem,4vw,2.5rem)] font-light tracking-tight">Thank you!</p>
                  <p className="mt-2 text-lg text-ink/70">Proceed for the next step</p>
                </div>
              ) : (
                <form key={step} onSubmit={handleSubmit} noValidate className="fade-up w-full">
                  <p className="mb-1 text-sm uppercase leading-6 text-mute">{hint}</p>
                  {/* The underline hugs the text: an invisible copy of the text sets the width (inline-grid trick) */}
                  <div className="mx-auto inline-grid max-w-full border-b border-ink text-[clamp(2rem,3.125vw,3.75rem)] font-light leading-[1.07] tracking-[-0.05em]">
                    <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre px-1">
                      {value || (isName ? "Introduce Yourself" : "Where are you from?")}
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      size={1}
                      autoComplete={isName ? "name" : "address-level2"}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder={isName ? "Introduce Yourself" : "Where are you from?"}
                      aria-label={isName ? "Your name" : "Your city"}
                      aria-invalid={!!error}
                      className="col-start-1 row-start-1 w-full min-w-0 bg-transparent px-1 text-center text-ink outline-none placeholder:text-ink"
                    />
                  </div>
                  <p className="mt-3 min-h-5 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                </form>
              )}
            </div>
          </>
        )}
      </section>

      <footer className="relative z-10 flex h-[124px] items-center justify-between px-4 pb-4 sm:px-8">
        <DiamondButton label="BACK" direction="left" onClick={handleBack} />
        {step === "done" ? (
          <DiamondButton label="PROCEED" direction="right" href="/result" />
        ) : (
          // PROCEED only shows once the field holds a valid value (frame 505)
          valid &&
          step !== "submitting" && (
            <DiamondButton label="PROCEED" direction="right" onClick={() => handleSubmit()} />
          )
        )}
      </footer>
    </main>
  );
}
