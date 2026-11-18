"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DiamondButton from "@/components/DiamondButton";
import Loader from "@/components/Loader";
import { ApertureIcon, ShutterIcon } from "@/components/Icons";
import { analyzeImage } from "@/lib/analyze";

type Status = "starting" | "live" | "captured" | "analyzing" | "error";

function Tips({ light }: { light?: boolean }) {
  return (
    <div className={`text-center text-xs uppercase leading-6 sm:text-sm ${light ? "text-white" : "text-ink"}`}>
      <p className="mb-4">To get better results make sure to have</p>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-1">
        {["Neutral expression", "Frontal pose", "Adequate lighting"].map((t) => (
          <span key={t} className="flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rotate-45 border ${light ? "border-white" : "border-ink"}`} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Figma frames 007 (setting up), 009 (live feed), 010 (captured). */
export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("starting");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setStatus("starting");
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser doesn't support camera access. Try uploading a photo instead.");
      setStatus("error");
      return;
    }
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // front camera on phones/tablets
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("live");
    } catch (err) {
      console.error(err);
      const name = (err as DOMException)?.name;
      setError(
        name === "NotAllowedError"
          ? "Camera access was blocked. Allow camera access in your browser settings and try again."
          : name === "NotFoundError"
          ? "No camera was found on this device."
          : "We couldn't start your camera."
      );
      setStatus("error");
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror so the saved photo matches the preview the user saw
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
    setStatus("captured");
    stopCamera();
  }

  function retake() {
    setPhoto(null);
    startCamera();
  }

  async function submitPhoto() {
    if (!photo) return;
    setStatus("analyzing");
    try {
      await analyzeImage(photo);
      router.push("/select");
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze that photo. Please try again.");
      setStatus("captured");
    }
  }

  if (status === "analyzing") {
    return (
      <main className="flex h-dvh flex-col">
        <Loader text="Preparing your analysis ..." />
      </main>
    );
  }

  const dark = status === "live" || status === "captured";

  return (
    <main className={`relative h-dvh w-full overflow-hidden ${dark ? "bg-black" : "bg-[#fcfcfc]"}`}>
      {/* Live feed / captured photo fill the screen. The video element stays mounted so the stream can attach. */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${status === "live" ? "opacity-100" : "opacity-0"}`}
        style={{ transform: "scaleX(-1)" }}
      />
      {photo && status === "captured" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="Your selfie" className="absolute inset-0 h-full w-full object-cover" />
      )}

      <div className="relative z-10 flex h-full flex-col">
        <Header section="ANALYSIS" light={dark} />

        {status === "starting" && (
          <Loader text="Setting up camera ..." icon={<ApertureIcon className="h-[120px] w-[120px] text-ink sm:h-[152px] sm:w-[152px]" />}>
            <div className="mt-2 px-4">
              <Tips />
            </div>
          </Loader>
        )}

        {status === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="max-w-sm text-sm">{error}</p>
            <div className="flex gap-3">
              <button type="button" onClick={startCamera} className="bg-ink px-4 py-2 text-xs font-semibold uppercase text-white">
                Try again
              </button>
              <button type="button" onClick={() => router.push("/result")} className="border border-ink px-4 py-2 text-xs font-semibold uppercase">
                Upload instead
              </button>
            </div>
          </div>
        )}

        {status === "live" && (
          <>
            <button
              type="button"
              onClick={capture}
              aria-label="Take picture"
              className="group absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-4 text-sm font-semibold uppercase text-white sm:right-8 max-sm:bottom-[136px] max-sm:left-1/2 max-sm:right-auto max-sm:top-auto max-sm:-translate-x-1/2 max-sm:translate-y-0 max-sm:flex-col-reverse max-sm:gap-2"
            >
              <span>Take picture</span>
              <ShutterIcon className="h-[60px] w-[60px] transition-transform group-hover:scale-105" />
            </button>
            <div className="mt-auto px-4 pb-[72px] sm:pb-[48px]">
              <Tips light />
            </div>
          </>
        )}

        {status === "captured" && (
          <>
            <p className="fade-up mt-4 text-center text-sm font-semibold uppercase text-white">Great shot!</p>
            <div className="mt-auto pb-[88px] text-center sm:pb-[48px]">
              <p className="mb-4 text-base font-semibold text-white">Preview</p>
              {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
              <div className="flex justify-center gap-4">
                <button type="button" onClick={retake} className="bg-[#fcfcfc] px-4 py-2 text-sm text-ink hover:bg-panel">
                  Retake
                </button>
                <button type="button" onClick={submitPhoto} className="bg-ink px-4 py-2 text-sm text-white hover:opacity-80">
                  Use This Photo
                </button>
              </div>
            </div>
          </>
        )}

        <div className="absolute bottom-6 left-4 sm:bottom-8 sm:left-8">
          <DiamondButton label="BACK" direction="left" href="/result" light={dark} iconOnlyMobile={dark} />
        </div>
      </div>
    </main>
  );
}
