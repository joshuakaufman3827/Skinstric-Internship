/** Camera aperture icon (camera option on the result page / camera loader). */
export function ApertureIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 136 136" fill="none" className={className} aria-hidden>
      <circle cx="68" cy="68" r="67" stroke="currentColor" strokeWidth="2" />
      <circle cx="68" cy="68" r="56" fill="currentColor" />
      <circle cx="68" cy="68" r="44" fill="#fcfcfc" />
      {/* six blades */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line
            key={a}
            x1="68"
            y1="24"
            x2="80"
            y2="58"
            transform={`rotate(${a} 68 68)`}
          />
        ))}
      </g>
      <polygon
        points="68,55 79.3,61.5 79.3,74.5 68,81 56.7,74.5 56.7,61.5"
        fill="currentColor"
      />
    </svg>
  );
}

/** Gallery icon (circle with sun and hills). */
export function GalleryIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 136 136" fill="none" className={className} aria-hidden>
      <circle cx="68" cy="68" r="67" stroke="currentColor" strokeWidth="2" />
      <circle cx="68" cy="68" r="56" stroke="currentColor" strokeWidth="2" />
      <defs>
        <clipPath id="gallery-clip">
          <circle cx="68" cy="68" r="50" />
        </clipPath>
      </defs>
      <g clipPath="url(#gallery-clip)" fill="currentColor">
        <circle cx="78" cy="48" r="10" />
        <path d="M14 96 C34 70 50 70 66 84 C80 96 92 76 104 68 C112 64 120 66 126 72 L126 126 L14 126 Z" />
      </g>
    </svg>
  );
}

/** White round "take picture" button on the live camera screen. */
export function ShutterIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden>
      <circle cx="30" cy="30" r="29" fill="white" stroke="white" />
      <circle cx="30" cy="30" r="24" stroke="#a0a4ab" strokeWidth="1" />
      <rect x="19" y="23" width="22" height="16" rx="2" stroke="#a0a4ab" strokeWidth="1.5" />
      <path d="M25 23l2-3h6l2 3" stroke="#a0a4ab" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="30" cy="31" r="4.5" stroke="#a0a4ab" strokeWidth="1.5" />
    </svg>
  );
}

/** Small diagonal pointer line from an icon to its label. */
export function PointerLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 66 59" className={className} aria-hidden>
      <line x1="1" y1="58" x2="62" y2="4" stroke="currentColor" strokeWidth="1" />
      <circle cx="62" cy="4" r="3" fill="none" stroke="currentColor" />
    </svg>
  );
}
