/**
 * The three nested dotted rhombuses ("rombuses" in the Figma).
 * Default sizes match the testing / select screens: 602, 682, 762 px at 1920 wide.
 * Each one shrinks on small screens and spins slowly at its own speed.
 */
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
            width: `min(${s}px, ${Math.round((s / 762) * 78)}vw)`,
            transform: "rotate(45deg)",
            opacity: opacities[i],
            animationDuration: `${speeds[i]}s`,
          }}
        />
      ))}
    </div>
  );
}
