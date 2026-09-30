/**
 * Rendu du profil gravé, partagé entre la version statique (serveur, zéro JS)
 * et la version animée (client, Motion). Les éléments qui changent selon les
 * paramètres passent par des « fabriques » : <path> simple ou <motion.path>.
 */
import type { ReactNode } from "react";
import type { ProfilParams } from "./profil-types";
import { BEARD, EAR, EAR_IN, FADE_TOP, HEAD, MOUSTACHE, SIDES, TOP } from "./profil-geometrie";

export interface ProfilOptions extends ProfilParams {
  className?: string;
  title?: string;
  /** Repères rouges (hauteur du fondu) — configurateur */
  guides?: boolean;
  /** Cape de coupe en bas */
  cape?: boolean;
  /** Vapeur de serviette chaude (rasage) */
  vapeur?: boolean;
}

export interface Fabriques {
  /** Tracé dont le `d` peut changer */
  Trace: (p: { d: string; fill?: string; fillOpacity?: string }) => ReactNode;
  /** Rectangle du masque de fondu */
  Fondu: (p: { y: number; opacity: number; fill: string }) => ReactNode;
  /** Groupe dont l'opacité peut changer */
  Opacite: (p: { opacity: number; children: ReactNode }) => ReactNode;
  /** Groupe des repères (translation verticale) */
  Repere: (p: { y: number; opacity: number; children: ReactNode }) => ReactNode;
}

export function renduProfil(o: ProfilOptions, uid: string, F: Fabriques) {
  const { fade, skin, dessus, barbe, moustache, negliges, trace, className, title, guides = false, cape = true, vapeur = false } = o;
  const topPath = negliges ? TOP.negliges : TOP[dessus];
  const sidesPath = negliges ? SIDES.negliges : SIDES.net;
  const beardPath = barbe === "taille" ? BEARD.taille : barbe === "pleine" ? (negliges ? BEARD.negliges : BEARD.pleine) : null;
  const fadeTop = FADE_TOP[fade];
  const fadeVisible = fade === "bas" || fade === "moyen" || fade === "haut";
  const baseOpacity = skin ? 1 : 0.8;

  return (
    <svg
      viewBox="0 0 400 480"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ color: "var(--ink, currentColor)" }}
    >
      <defs>
        <pattern id={`h-${uid}`} width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <line x1="0" y1="0" x2="0" y2="3.4" stroke="currentColor" strokeWidth="1.25" />
        </pattern>
        <pattern id={`t-${uid}`} width="4.2" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-62)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </pattern>
        <pattern id={`b-${uid}`} width="3" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(78)">
          <line x1="0" y1="0" x2="0" y2="3.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </pattern>
        <pattern id={`c-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="6" y2="0" stroke="var(--paper, #f2ede4)" strokeWidth="0.6" opacity="0.35" />
        </pattern>

        {/* Dégradé : noir = cheveux retirés. Le rectangle glisse selon la hauteur du fondu. */}
        <linearGradient id={`fg-${uid}`} x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(-5 .5 .5)">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.28" stopColor="#000" stopOpacity={baseOpacity * 0.85} />
          <stop offset="0.42" stopColor="#000" stopOpacity={baseOpacity} />
          <stop offset="1" stopColor="#000" stopOpacity={baseOpacity} />
        </linearGradient>
        <radialGradient id={`tp-${uid}`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <mask id={`m-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="480">
          <rect width="400" height="480" fill="#fff" />
          {F.Fondu({ y: fadeVisible ? fadeTop : 480, opacity: fadeVisible ? 1 : 0, fill: `url(#fg-${uid})` })}
          {F.Opacite({
            opacity: fade === "taper" ? 1 : 0,
            children: (
              <>
                <ellipse cx="150" cy="412" rx="46" ry="40" fill={`url(#tp-${uid})`} />
                <ellipse cx="244" cy="312" rx="22" ry="34" fill={`url(#tp-${uid})`} />
              </>
            ),
          })}
        </mask>
        <clipPath id={`k-${uid}`}>{F.Trace({ d: topPath })}</clipPath>
      </defs>

      {title ? <title>{title}</title> : null}

      {/* Peau */}
      <path d={HEAD} fill="var(--paper, #f2ede4)" />

      {/* Cheveux : côtés (masqués par le dégradé) + dessus */}
      <g mask={`url(#m-${uid})`}>
        {F.Trace({ d: sidesPath, fill: "currentColor", fillOpacity: "0.14" })}
        {F.Trace({ d: sidesPath, fill: `url(#h-${uid})` })}
      </g>
      {F.Trace({ d: topPath, fill: "currentColor", fillOpacity: "0.2" })}
      {F.Trace({ d: topPath, fill: `url(#t-${uid})` })}
      {/* Mèches : lignes de flux, découpées par la forme du dessus */}
      <g clipPath={`url(#k-${uid})`} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.85">
        <path d="M110 150C160 110 240 80 350 110" />
        <path d="M118 132C170 96 250 70 356 92" />
        <path d="M130 116C190 80 260 60 350 74" />
        <path d="M150 100C200 70 270 50 340 58" />
        <path d="M200 146C240 120 290 110 352 126" />
      </g>

      {/* Trace au rasoir */}
      {trace ? <path d="M140 232C170 222 200 220 236 226" fill="none" stroke="var(--paper, #f2ede4)" strokeWidth="3.2" strokeLinecap="round" /> : null}

      {/* Barbe */}
      {beardPath ? (
        <g>
          {F.Trace({ d: beardPath, fill: "currentColor", fillOpacity: "0.16" })}
          {F.Trace({ d: beardPath, fill: `url(#b-${uid})` })}
        </g>
      ) : null}
      {moustache || barbe === "taille" || barbe === "pleine" ? <path d={MOUSTACHE} fill={`url(#b-${uid})`} /> : null}

      {/* Oreille par-dessus les cheveux */}
      <path d={EAR} fill="var(--paper, #f2ede4)" stroke="currentColor" strokeWidth="1.5" />
      <path d={EAR_IN} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

      {/* Traits du visage */}
      <path d={HEAD} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M298 244C310 239 322 239 331 244" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M311 263C317 266 323 266 328 262" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Rasage : vapeur de serviette chaude */}
      {vapeur && barbe === "rasage" ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.7">
          <path d="M366 300C356 290 374 280 364 268C356 258 370 250 364 240" />
          <path d="M382 318C372 306 390 298 380 286C372 276 386 268 380 258" />
        </g>
      ) : null}

      {/* Cape de coupe */}
      {cape ? (
        <g>
          <path d="M40 480C96 446 160 430 214 432C260 430 318 438 390 480Z" fill="currentColor" />
          <path d="M40 480C96 446 160 430 214 432C260 430 318 438 390 480Z" fill={`url(#c-${uid})`} />
          <path d="M150 438C190 426 240 424 282 432" fill="none" stroke="var(--paper, #f2ede4)" strokeWidth="1.2" strokeDasharray="2 3" />
        </g>
      ) : null}

      {/* Repères du configurateur */}
      {guides
        ? F.Repere({
            y: fadeVisible ? fadeTop - 244 : 0,
            opacity: fadeVisible ? 1 : 0,
            children: (
              <g style={{ color: "var(--color-rouge)" }}>
                <line x1="14" y1="244" x2="96" y2="244" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="98" cy="244" r="2.5" fill="currentColor" />
                <text x="14" y="236" fill="currentColor" fontSize="11" letterSpacing="1.2" fontFamily="var(--font-sans)" fontWeight="600">
                  FONDU
                </text>
              </g>
            ),
          })
        : null}
    </svg>
  );
}
