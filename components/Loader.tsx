import { ReactNode } from "react";

/** "Preparing your analysis ..." / "Setting up camera ..." screen from the Figma. */
export default function Loader({
  text,
  icon,
  children,
}: {
  text: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden py-16">
      <div className="relative flex h-[min(480px,80vw)] w-[min(480px,80vw)] items-center justify-center">
        <div className="loader-square w-[62%]" style={{ animationDuration: "12s" }} />
        <div className="loader-square w-[74%] opacity-50" style={{ animationDuration: "18s", animationDirection: "reverse" }} />
        <div className="loader-square w-[86%] opacity-25" style={{ animationDuration: "24s" }} />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {icon}
          <p className="animate-pulse text-sm font-semibold uppercase">{text}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
