/**
 * Tondeuse dessinée (repli sans WebGL, et premier affichage avant la 3D) :
 * corps laqué noir, bague et interrupteur or, tête chromée, sabot à côtes.
 * Aucun texte dans le SVG : rien à attendre pour l'afficher.
 */
export function TondeuseSVG({ className }: { className?: string }) {
  const dents = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg viewBox="0 0 640 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="tondeuse-laque" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="0.28" stopColor="#1a1a1a" />
          <stop offset="0.7" stopColor="#0b0b0b" />
          <stop offset="1" stopColor="#1c1c1c" />
        </linearGradient>
        <linearGradient id="tondeuse-or" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dcb2" />
          <stop offset="0.5" stopColor="#c9a064" />
          <stop offset="1" stopColor="#8a6a3a" />
        </linearGradient>
        <linearGradient id="tondeuse-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9ced2" />
          <stop offset="1" stopColor="#6f757a" />
        </linearGradient>
      </defs>

      {/* Corps : queue arrondie, taille marquée, tête évasée */}
      <path
        d="M40 100 C40 70 58 62 90 62 L250 64 C300 66 330 56 400 50 L470 46 C492 45 500 60 500 100 C500 140 492 155 470 154 L400 150 C330 144 300 134 250 136 L90 138 C58 138 40 130 40 100 Z"
        fill="url(#tondeuse-laque)"
      />
      {/* Reflet de vernis */}
      <path d="M92 72 L250 74 C300 76 330 66 400 60 L468 57" stroke="#fff" strokeOpacity="0.22" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Nervures de prise */}
      {[110, 124, 138, 152, 166].map((x) => (
        <line key={x} x1={x} y1="68" x2={x} y2="132" stroke="#2e2e2e" strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* Bague or */}
      <rect x="330" y="53" width="12" height="94" rx="5" fill="url(#tondeuse-or)" />
      {/* Interrupteur et témoin */}
      <rect x="392" y="42" width="44" height="10" rx="5" fill="url(#tondeuse-or)" />
      <circle cx="452" cy="47" r="3.5" fill="#f5c46a" />

      {/* Tête : support, lame fixe chromée et dents */}
      <rect x="494" y="56" width="26" height="88" rx="8" fill="#141414" />
      <rect x="518" y="62" width="30" height="76" rx="4" fill="url(#tondeuse-chrome)" />
      {dents.map((i) => (
        <rect key={i} x="546" y={64 + i * 4.6} width="14" height="2.6" rx="1.2" fill="#d9dde0" />
      ))}

      {/* Sabot : côtes noires recourbées devant la lame */}
      {dents.slice(0, 9).map((i) => (
        <path
          key={i}
          d={`M516 ${58 + i * 9.5} L566 ${58 + i * 9.5} Q590 ${60 + i * 9.5} 588 ${76 + i * 9.5}`}
          stroke="#262626"
          strokeOpacity="0.92"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}
