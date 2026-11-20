/**
 * Figma sizes are tip-to-tip widths on a 1920px-wide frame.
 * Side of the square = width / √2. Scale with the screen like the Figma,
 * never larger than the Figma size, and not too small on phones.
 */
function sideWidth(figmaWidth: number) {
  const side = figmaWidth / Math.SQRT2;
  const vw = (side / 1920) * 100;
  return `clamp(${Math.round(side * 0.45)}px, ${vw.toFixed(2)}vw, ${Math.round(side)}px)`;
}

/** The three nested dotted rhombuses. */
export default function DiamondRings({
  sizes = [602, 682, 762],
  spin = false,
  className = "",
}: {
  sizes?: [number, number, number];
  spin?: boolean;
  className?: string;
}) {
  const speeds = [60, 80, 100];
  const opacities = [1, 0.6, 0.35];
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      aria-hidden
    >
      {sizes.map((s, i) => (
        <div
          key={i}
          className={`rhombus ${spin ? "rhombus-spin" : ""}`}
          style={{
            width: sideWidth(s),
            height: sideWidth(s),
            transform: "rotate(45deg)",
            opacity: opacities[i],
            animationDuration: `${speeds[i]}s`,
          }}
        />
      ))}
    </div>
  );
}
