"use client";

import Link from "next/link";

interface Props {
  label: string;
  direction: "left" | "right";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** white version for dark backgrounds */
  light?: boolean;
  /** hide the text on small screens (camera screen) */
  iconOnlyMobile?: boolean;
}

/** "button-icon-text-shrunk" from the Figma: a 44px-tall rotated square with a play arrow + label. */
export default function DiamondButton({
  label,
  direction,
  href,
  onClick,
  disabled,
  light,
  iconOnlyMobile,
}: Props) {
  const color = light ? "border-white text-white" : "border-ink text-ink";

  const content = (
    <span
      className={`group inline-flex h-11 items-center gap-4 text-sm font-semibold uppercase ${
        light ? "text-white" : "text-ink"
      } ${direction === "right" ? "flex-row-reverse" : ""} ${
        disabled ? "pointer-events-none opacity-30" : ""
      }`}
    >
      <span
        className={`relative flex h-[30px] w-[30px] items-center justify-center border ${color} transition-transform duration-300 group-hover:scale-110`}
        style={{ transform: "rotate(45deg)" }}
      >
        <span style={{ transform: "rotate(-45deg)" }} className="block">
          <svg
            width="8"
            height="9"
            viewBox="0 0 8 9"
            className={direction === "left" ? "rotate-180" : ""}
            fill="currentColor"
            aria-hidden
          >
            <path d="M0 0L8 4.5L0 9V0Z" />
          </svg>
        </span>
      </span>
      <span className={iconOnlyMobile ? "hidden sm:inline" : ""}>{label}</span>
    </span>
  );

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={label}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label}>
      {content}
    </button>
  );
}
