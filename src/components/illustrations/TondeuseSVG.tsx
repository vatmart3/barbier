/**
 * Tondeuse dessinée (repli sans WebGL, et premier affichage avant la 3D),
 * d'après une tondeuse de coupe moderne : corps noir mat qui s'évase vers la
 * tête, capot laqué cerclé d'un liseré chromé en V, lame dentée, levier de
 * réglage, bouton ovale chromé. Fond transparent, aucun texte dans le SVG.
 */
export function TondeuseSVG({ className }: { className?: string }) {
  const dents = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg viewBox="0 0 640 220" className={className} aria-hidden>
      <defs>
        <linearGradient id="tondeuse-mat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3c" />
          <stop offset="0.22" stopColor="#1c1c1e" />
          <stop offset="0.75" stopColor="#0c0c0d" />
          <stop offset="1" stopColor="#1e1e20" />
        </linearGradient>
        <linearGradient id="tondeuse-laque" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a4d" />
          <stop offset="0.3" stopColor="#141415" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="tondeuse-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9ced2" />
          <stop offset="1" stopColor="#6f757a" />
        </linearGradient>
      </defs>

      {/* Corps : queue arrondie et fine, s'évase jusqu'à la tête */}
      <path
        d="M34 110 C34 92 44 86 62 85 L250 78 C330 74 400 60 470 52 L512 49 C530 48 540 60 540 110 C540 160 530 172 512 171 L470 168 C400 160 330 146 250 142 L62 135 C44 134 34 128 34 110 Z"
        fill="url(#tondeuse-mat)"
      />
      {/* Capot laqué de la tête */}
      <path d="M395 63 C430 57 470 52 512 49 C530 48 540 60 540 110 C540 160 530 172 512 171 C470 168 430 163 395 157 C372 140 366 80 395 63 Z" fill="url(#tondeuse-laque)" />
      {/* Liseré chromé en V */}
      <path d="M534 58 L470 56 C430 60 400 72 380 110 C400 148 430 160 470 164 L534 162" stroke="url(#tondeuse-chrome)" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Reflet sur le corps */}
      <path d="M66 92 L250 86 C330 82 380 72 440 64" stroke="#fff" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Bouton ovale chromé à deux rainures */}
      <rect x="292" y="96" width="44" height="28" rx="12" fill="url(#tondeuse-chrome)" />
      <path d="M308 101 V119 M320 101 V119" stroke="#5a5e62" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="354" cy="110" r="3.5" fill="#7df0b0" />
      {/* Deux vis côté queue */}
      <circle cx="70" cy="110" r="4" fill="#9aa0a6" />
      <circle cx="96" cy="110" r="4" fill="#9aa0a6" />

      {/* Levier de réglage, sous la tête */}
      <path d="M470 150 C455 168 430 186 404 196 C396 199 391 191 398 186 C420 172 440 158 456 140 Z" fill="#101011" stroke="#2c2c2e" strokeWidth="1.5" />
      <circle cx="466" cy="146" r="7" fill="url(#tondeuse-chrome)" />

      {/* Tête : support, lame fixe chromée et dents */}
      <rect x="536" y="56" width="18" height="108" rx="7" fill="#0b0b0c" />
      <rect x="552" y="60" width="26" height="100" rx="4" fill="url(#tondeuse-chrome)" />
      {dents.map((i) => (
        <rect key={i} x="576" y={62 + i * 4.4} width="16" height="2.4" rx="1.1" fill="#dfe2e5" />
      ))}
    </svg>
  );
}
