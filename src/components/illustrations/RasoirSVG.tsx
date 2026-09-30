/**
 * Rasoir coupe-chou gravé (fallback de la 3D). Lame acier en hachures fines,
 * manche corne plein. Ouvert, lame vers la gauche, pivot au centre.
 */
export function RasoirSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 220" className={className} aria-hidden>
      <defs>
        <linearGradient id="rz-acier" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2ede4" />
          <stop offset="0.35" stopColor="#c3c8cc" />
          <stop offset="0.55" stopColor="#6e757b" />
          <stop offset="0.75" stopColor="#d9dde0" />
          <stop offset="1" stopColor="#9aa0a6" />
        </linearGradient>
        <linearGradient id="rz-corne" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a211b" />
          <stop offset="0.4" stopColor="#15110e" />
          <stop offset="0.7" stopColor="#3a2c22" />
          <stop offset="1" stopColor="#120e0c" />
        </linearGradient>
        <pattern id="rz-h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#111" strokeWidth="0.6" opacity="0.35" />
        </pattern>
      </defs>
      {/* Manche (corne) */}
      <path d="M318 96C300 92 294 116 312 124L596 136C624 136 628 100 600 98Z" fill="url(#rz-corne)" stroke="#9aa0a6" strokeWidth="0.8" />
      <path d="M330 104L590 110" stroke="#f2ede4" strokeOpacity="0.12" strokeWidth="1.2" />
      {/* Lame */}
      <path
        d="M340 104L322 102L92 94C64 93 50 104 52 124C54 146 72 160 100 160C180 160 260 150 306 138C318 134 324 124 322 114Z"
        fill="url(#rz-acier)"
        stroke="#f2ede4"
        strokeWidth="1"
      />
      <path d="M340 104L322 102L92 94C64 93 50 104 52 124C54 146 72 160 100 160C180 160 260 150 306 138C318 134 324 124 322 114Z" fill="url(#rz-h)" />
      {/* Fil de la lame */}
      <path d="M58 136C80 158 200 156 300 138" stroke="#f2ede4" strokeWidth="1.4" fill="none" />
      {/* Talon, crans, queue */}
      <path d="M322 102L366 104C380 104 390 110 388 118C386 124 376 124 370 120L340 118" fill="#9aa0a6" stroke="#f2ede4" strokeWidth="0.8" />
      <path d="M346 104v12M352 104v12M358 105v12" stroke="#111" strokeWidth="1" />
      {/* Axes */}
      <circle cx="318" cy="110" r="5" fill="#d9dde0" stroke="#111" />
      <circle cx="592" cy="118" r="4" fill="#d9dde0" stroke="#111" />
      {/* Gravure (traits, pas de texte : rien à attendre au premier affichage) */}
      <path d="M150 121h118M160 126h98" stroke="#111" strokeOpacity="0.28" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 4" />
    </svg>
  );
}
