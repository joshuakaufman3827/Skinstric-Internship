"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DiamondButton from "@/components/DiamondButton";
import Loader from "@/components/Loader";
import ScanOption from "@/components/ScanOption";
import { ApertureIcon, GalleryIcon } from "@/components/Icons";
import { analyzeImage } from "@/lib/analyze";
import { fileToDataUrl } from "@/lib/image";

const MAX_FILE_MB = 15;

/** Figma frames 005 (options), 006 (camera permission prompt), 011 (loading). */
export default function ResultPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askCamera, setAskCamera] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Please choose an image under ${MAX_FILE_MB} MB.`);
      return;
    }
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setLoading(true);
      await analyzeImage(dataUrl);
      router.push("/select");
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze that image. Please try another one.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex h-dvh flex-col">
        <Loader text="Preparing your analysis ..." />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <p className="px-4 pt-[22px] text-base font-semibold uppercase leading-6 sm:px-8">To start analysis</p>

      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-6 lg:flex-row lg:justify-around lg:gap-0 lg:px-[6vw]">
        <ScanOption
          icon={<ApertureIcon className="h-full w-full" />}
          label={["Allow A.I.", "to scan your face"]}
          labelSide="top-right"
          onClick={() => setAskCamera(true)}
          ariaLabel="Take a selfie"
        >
          {askCamera && (
            <div
              role="dialog"
              aria-label="Allow A.I. to access your camera"
              className="fade-up absolute left-1/2 top-1/2 z-30 w-[min(352px,86vw)] -translate-x-1/2 bg-ink text-white shadow-xl sm:left-[calc(50%_+_40px)] sm:translate-x-0"
            >
              <p className="px-4 pb-10 pt-4 text-base font-semibold uppercase leading-6">
                Allow A.I. to access your camera
              </p>
              <div className="flex justify-end gap-8 border-t border-white px-4 py-2 text-sm font-semibold uppercase leading-6">
                <button type="button" className="text-white/60 hover:text-white" onClick={() => setAskCamera(false)}>
                  Deny
                </button>
                <button type="button" className="hover:opacity-70" onClick={() => router.push("/camera")}>
                  Allow
                </button>
              </div>
            </div>
          )}
        </ScanOption>

        <ScanOption
          icon={<GalleryIcon className="h-full w-full" />}
          label={["Allow A.I.", "access gallery"]}
          labelSide="bottom-left"
          onClick={() => fileRef.current?.click()}
          ariaLabel="Upload an image from your gallery"
          dimmed={askCamera}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </ScanOption>
      </section>

      {error && (
        <p className="px-6 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <footer className="relative z-10 flex h-[124px] items-center justify-between px-4 pb-4 sm:px-8">
        <DiamondButton label="BACK" direction="left" href="/testing" />
      </footer>
    </main>
  );
}
