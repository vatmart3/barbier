/**
 * La devanture, Grand'Rue, dessinée en aplats arrondis : façade noire,
 * store festonné cuivre, vitrine éclairée, porte en arche, enseigne de
 * barbier et un vélo garé devant. En attendant de vraies photos (ASSETS.md).
 */
const ENCRE = "#1d1d1f";
const CUIVRE = "#b3541e";
const CREME = "#f5efe6";

export function IllustrationDevanture({ className, title }: { className?: string; title: string }) {
  return (
    <svg viewBox="0 0 800 500" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="dev-vitrine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3bd" />
          <stop offset="1" stopColor="#e9b98a" />
        </linearGradient>
        <clipPath id="dev-poteau">
          <rect x={58} y={200} width={24} height={110} rx={12} />
        </clipPath>
        <clipPath id="dev-store">
          <rect x={120} y={196} width={560} height={46} />
        </clipPath>
      </defs>

      {/* mur en pierre claire */}
      <rect width={800} height={500} fill="#ece2d4" />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 100 - (r % 2) * 50 + 6} y={r * 70 + 6} width={88} height={58} rx={14} fill="#e4d8c7" />
        )),
      )}

      {/* façade */}
      <rect x={110} y={92} width={580} height={368} rx={30} fill={ENCRE} />
      <text x={400} y={160} textAnchor="middle" fill={CREME} style={{ font: "600 56px var(--font-display), Georgia, serif" }}>
        Dégradé
      </text>
      <text x={400} y={184} textAnchor="middle" fill="#d9a57c" style={{ font: "600 13px var(--font-sans), sans-serif", letterSpacing: "0.3em" }}>
        BARBIER · SÈTE
      </text>

      {/* store festonné */}
      <g clipPath="url(#dev-store)">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={120 + i * 40} y={196} width={40} height={46} fill={i % 2 ? CREME : CUIVRE} />
        ))}
      </g>
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={140 + i * 40} cy={242} r={20} fill={i % 2 ? CREME : CUIVRE} />
      ))}
      <rect x={116} y={190} width={568} height={10} rx={5} fill="#8a3d14" />

      {/* vitrine */}
      <rect x={146} y={284} width={300} height={150} rx={24} fill="url(#dev-vitrine)" />
      <rect x={240} y={330} width={60} height={70} rx={18} fill="#3a2a22" opacity={0.85} />
      <rect x={228} y={390} width={84} height={22} rx={10} fill="#3a2a22" opacity={0.85} />
      <rect x={322} y={330} width={60} height={70} rx={18} fill="#3a2a22" opacity={0.85} />
      <rect x={310} y={390} width={84} height={22} rx={10} fill="#3a2a22" opacity={0.85} />
      <path d="M186 300 l-26 60 M214 300 l-44 100" stroke="#fff" strokeOpacity={0.45} strokeWidth={8} strokeLinecap="round" />
      <rect x={146} y={284} width={300} height={150} rx={24} fill="none" stroke="#3a3a3e" strokeWidth={8} />

      {/* porte en arche */}
      <path d="M482 460 V330 a62 62 0 0 1 124 0 V460 Z" fill="#2c2c30" />
      <circle cx={544} cy={336} r={30} fill="url(#dev-vitrine)" />
      <circle cx={586} cy={402} r={6} fill={CUIVRE} />
      <line x1={528} y1={362} x2={528} y2={378} stroke="#8a8a90" strokeWidth={2} />
      <line x1={560} y1={362} x2={560} y2={378} stroke="#8a8a90" strokeWidth={2} />
      <rect x={512} y={376} width={64} height={26} rx={13} fill={CREME} />
      <text x={544} y={394} textAnchor="middle" fill={ENCRE} style={{ font: "700 13px var(--font-sans), sans-serif" }}>
        Ouvert
      </text>

      {/* plantes de part et d'autre de la porte */}
      {[462, 626].map((x) => (
        <g key={x}>
          <circle cx={x} cy={414} r={16} fill="#6d8566" />
          <circle cx={x - 10} cy={424} r={12} fill="#7f9677" />
          <circle cx={x + 10} cy={424} r={12} fill="#8fa587" />
          <path d={`M${x - 16} 432 h32 l-4 26 a6 6 0 0 1 -6 5 h-12 a6 6 0 0 1 -6 -5 Z`} fill={CUIVRE} />
        </g>
      ))}

      {/* enseigne de barbier au mur */}
      <rect x={90} y={250} width={22} height={8} rx={4} fill={ENCRE} />
      <rect x={50} y={188} width={40} height={16} rx={8} fill={ENCRE} />
      <rect x={50} y={306} width={40} height={16} rx={8} fill={ENCRE} />
      <g clipPath="url(#dev-poteau)">
        <rect x={58} y={200} width={24} height={110} fill="#fff" />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M40 ${200 + i * 32} l60 -30 v12 l-60 30 Z`} fill={i % 2 ? "#2f5d8a" : "#c0392b"} />
        ))}
      </g>

      {/* trottoir */}
      <rect y={460} width={800} height={40} fill="#d8cab7" />
      <rect y={458} width={800} height={6} rx={3} fill="#cbbba5" />

      {/* vélo garé */}
      <g stroke={ENCRE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx={660} cy={452} r={30} />
        <circle cx={752} cy={452} r={30} />
        <path d="M660 452 L690 412 H736 L752 452 M690 412 L708 452 H660 M708 452 L736 412 M686 400 h14 M736 412 l-6 -16 h16" />
      </g>
      <rect x={736} y={384} width={30} height={20} rx={6} fill={CUIVRE} />
    </svg>
  );
}
