/**
 * L'intérieur du salon, dessiné en aplats arrondis : trois fauteuils face aux
 * miroirs en arche, suspensions cuivre, l'enseigne au mur, et Sabot, le chat
 * de la maison, qui dort par terre. En attendant de vraies photos (ASSETS.md).
 */
const ENCRE = "#2b2b2e";
const CUIVRE = "#b3541e";
const BOIS = "#b98a5e";
const CHROME = "#a7a7ae";

function Suspension({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy={96} r={120} fill="url(#salon-halo)" />
      <line x1={x} y1={0} x2={x} y2={70} stroke={ENCRE} strokeWidth={2} />
      <path d={`M${x - 30} 96 a30 30 0 0 1 60 0 Z`} fill={CUIVRE} />
      <circle cx={x} cy={98} r={6} fill="#fff4d6" />
    </g>
  );
}

function Miroir({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 64} 318 V190 a64 64 0 0 1 128 0 V318 Z`} fill="#dde5e8" stroke={ENCRE} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M${x - 30} 170 l-18 40 M${x - 14} 162 l-30 72`} stroke="#fff" strokeOpacity={0.75} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

function Fauteuil({ x }: { x: number }) {
  return (
    <g>
      <ellipse cx={x} cy={512} rx={52} ry={9} fill={CHROME} />
      <rect x={x - 7} y={462} width={14} height={50} rx={7} fill="#c4c4ca" />
      <rect x={x - 42} y={462} width={84} height={10} rx={5} fill={CHROME} />
      {/* dossier + appui-tête */}
      <rect x={x - 3} y={292} width={6} height={14} rx={3} fill={CHROME} />
      <rect x={x - 26} y={278} width={52} height={20} rx={10} fill={CUIVRE} />
      <rect x={x - 52} y={304} width={104} height={124} rx={28} fill={ENCRE} />
      {[0, 1].map((r) => [-22, 0, 22].map((dx) => <circle key={`${r}${dx}`} cx={x + dx} cy={340 + r * 36} r={3.5} fill="#404045" />))}
      {/* assise + accoudoirs */}
      <rect x={x - 64} y={414} width={128} height={44} rx={20} fill={ENCRE} />
      <rect x={x - 78} y={398} width={30} height={14} rx={7} fill={BOIS} />
      <rect x={x + 48} y={398} width={30} height={14} rx={7} fill={BOIS} />
      <rect x={x - 67} y={410} width={6} height={18} rx={3} fill={CHROME} />
      <rect x={x + 61} y={410} width={6} height={18} rx={3} fill={CHROME} />
    </g>
  );
}

export function IllustrationSalon({ className, title }: { className?: string; title: string }) {
  return (
    <svg viewBox="0 0 800 550" className={className} role="img" aria-label={title}>
      <defs>
        <radialGradient id="salon-halo">
          <stop offset="0" stopColor="#ffd9a8" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffd9a8" stopOpacity={0} />
        </radialGradient>
        <clipPath id="salon-enseigne">
          <rect x={726} y={150} width={28} height={140} rx={14} />
        </clipPath>
      </defs>

      {/* murs et sol */}
      <rect width={800} height={550} fill="#f1e9df" />
      <rect y={340} width={800} height={100} fill="#e6d8c7" />
      {Array.from({ length: 21 }, (_, i) => (
        <line key={i} x1={20 + i * 40} y1={352} x2={20 + i * 40} y2={430} stroke="#d9c6b0" strokeWidth={3} strokeLinecap="round" />
      ))}
      <rect y={440} width={800} height={110} fill="#d9c9b6" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 80 + (i % 2) * 40 - 20} y={470 + (i % 2) * 40} width={40} height={40} rx={6} fill="#cfbda8" />
      ))}

      {[190, 400, 610].map((x) => (
        <Suspension key={x} x={x} />
      ))}

      {/* horloge ronde */}
      <circle cx={295} cy={168} r={24} fill="#fff" stroke={ENCRE} strokeWidth={4} />
      <path d="M295 168 V152 M295 168 L306 174" stroke={ENCRE} strokeWidth={3} strokeLinecap="round" />

      {/* enseigne de barbier */}
      <rect x={720} y={134} width={40} height={18} rx={9} fill={ENCRE} />
      <rect x={720} y={288} width={40} height={18} rx={9} fill={ENCRE} />
      <g clipPath="url(#salon-enseigne)">
        <rect x={726} y={150} width={28} height={140} fill="#fff" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M700 ${150 + i * 36} l80 -40 v14 l-80 40 Z`} fill={i % 2 ? "#2f5d8a" : "#c0392b"} />
        ))}
      </g>

      {[190, 400, 610].map((x) => (
        <Miroir key={x} x={x} />
      ))}

      {/* tablette et petits objets */}
      <rect x={96} y={318} width={608} height={16} rx={8} fill={BOIS} />
      <rect x={140} y={292} width={16} height={28} rx={6} fill={CUIVRE} />
      <rect x={160} y={300} width={12} height={20} rx={5} fill="#7f9677" />
      <rect x={440} y={296} width={16} height={24} rx={6} fill={ENCRE} />
      <rect x={650} y={308} width={36} height={10} rx={5} fill={ENCRE} />

      {[190, 400, 610].map((x) => (
        <Fauteuil key={x} x={x} />
      ))}

      {/* plante */}
      <g>
        <ellipse cx={46} cy={352} rx={16} ry={40} fill="#7f9677" transform="rotate(-24 46 352)" />
        <ellipse cx={70} cy={344} rx={15} ry={44} fill="#6d8566" transform="rotate(14 70 344)" />
        <ellipse cx={58} cy={372} rx={12} ry={30} fill="#8fa587" />
        <path d="M30 400 h60 l-8 50 a8 8 0 0 1 -8 7 h-28 a8 8 0 0 1 -8 -7 Z" fill={CUIVRE} />
      </g>

      {/* Sabot, le chat, roulé en boule */}
      <g>
        <path d="M466 522 c-10 6 -34 6 -40 -6" stroke={ENCRE} strokeWidth={9} strokeLinecap="round" fill="none" />
        <ellipse cx={500} cy={508} rx={40} ry={20} fill={ENCRE} />
        <circle cx={530} cy={500} r={15} fill={ENCRE} />
        <path d="M520 491 l3 -14 l9 10 Z M534 488 l8 -12 l3 14 Z" fill={ENCRE} strokeLinejoin="round" />
        <path d="M526 502 q3 3 6 0 M536 501 q3 3 6 0" stroke="#f1e9df" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
