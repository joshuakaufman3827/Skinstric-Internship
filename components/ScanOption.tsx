import { ReactNode } from "react";
import DiamondRings from "./DiamondRings";
import { PointerLine } from "./Icons";

/**
 * One of the two options on the result page (Figma frame 005):
 * 482px rhombuses, a 136px icon in the middle, and a label on a pointer line.
 */
export default function ScanOption({
  icon,
  label,
  labelSide,
  onClick,
  ariaLabel,
  dimmed,
  children,
}: {
  icon: ReactNode;
  label: [string, string];
  labelSide: "top-right" | "bottom-left";
  onClick: () => void;
  ariaLabel: string;
  dimmed?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-[min(482px,78vw)] w-[min(482px,78vw)] items-center justify-center transition-opacity duration-300 lg:h-[min(482px,34vw)] lg:w-[min(482px,34vw)] ${
        dimmed ? "opacity-40" : ""
      }`}
    >
      <DiamondRings sizes={[405, 444, 482]} />
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="relative z-10 h-[108px] w-[108px] text-ink transition-transform duration-300 hover:scale-105 sm:h-[136px] sm:w-[136px]"
      >
        {icon}
      </button>

      {/* label + pointer line — offsets measured from the icon center in the Figma */}
      {labelSide === "top-right" ? (
        <div className="pointer-events-none absolute left-[calc(50%_+_40px)] hidden sm:block top-[calc(50%_-_115px)] z-10 h-[76px] w-[239px] text-xs uppercase leading-6 sm:text-sm">
          <PointerLine className="absolute left-0 top-[17px] h-[59px] w-[66px]" />
          <p className="absolute left-[72px] top-0 whitespace-nowrap">
            {label[0]}
            <br />
            {label[1]}
          </p>
        </div>
      ) : (
        <div className="pointer-events-none absolute left-[calc(50%_-_247px)] hidden sm:block top-[calc(50%_+_40px)] z-10 h-[93px] w-[210px] text-xs uppercase leading-6 sm:text-sm">
          <PointerLine className="absolute left-[144px] top-0 h-[59px] w-[66px] rotate-180" />
          <p className="absolute right-[74px] top-[45px] whitespace-nowrap text-right">
            {label[0]}
            <br />
            {label[1]}
          </p>
        </div>
      )}
      {/* phones: label sits under the icon */}
      <p className="pointer-events-none absolute top-[calc(50%_+_66px)] z-10 text-center text-xs uppercase leading-5 sm:hidden">
        {label[0]} {label[1]}
      </p>
      {children}
    </div>
  );
}
