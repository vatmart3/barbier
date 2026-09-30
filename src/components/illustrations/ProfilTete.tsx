"use client";

/**
 * Profil de tête gravé, paramétrique. Dessiné à la main (viewBox 400×480),
 * tourné vers la droite. Chaque variante de tracé garde la même structure de
 * commandes pour que Motion puisse les interpoler (morphing).
 * Encre = currentColor ; papier = var(--paper).
 */
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import type { ProfilParams } from "./profil-types";
import { ease } from "@/design/motion";

const HEAD =
  "M150 480C150 440 146 410 138 392C124 372 106 346 102 312C96 262 98 205 126 160C156 112 208 88 258 94C300 99 324 128 330 168C333 190 330 206 332 222C333 230 338 236 336 244C334 252 330 256 334 264L358 304C362 311 356 318 346 317C341 318 338 320 339 326C344 332 343 339 338 343C342 348 341 356 335 360C339 372 338 388 326 398C312 408 290 410 276 412C270 440 268 462 270 480Z";

const EAR = "M214 242C194 234 181 248 183 268C185 288 190 302 204 312C214 318 223 311 221 301C219 291 227 283 227 268C227 254 222 246 214 242Z";
const EAR_IN = "M210 256C200 254 195 262 197 272C199 282 204 290 211 292";

const TOP = {
  ras: "M129 160C190 150 250 146 302 142C312 140 320 138 324 131C320 100 292 86 256 88C204 90 150 108 124 156C125 158 127 159 129 160Z",
  court: "M129 160C190 150 250 146 302 142C316 140 330 134 336 122C330 88 296 72 254 74C196 76 140 98 116 150C120 156 124 158 129 160Z",
  long: "M129 160C190 150 250 146 302 142C322 142 346 128 350 104C342 64 300 52 250 56C186 60 126 86 106 146C114 154 120 158 129 160Z",
  negliges: "M122 168C190 158 250 150 306 146C330 150 358 142 364 116C356 60 304 40 248 44C178 48 112 80 94 150C102 160 112 166 122 168Z",
} as const;

const SIDES = {
  net: "M146 404C128 384 110 352 105 312C99 262 103 205 129 160C190 150 250 146 302 142C306 160 304 182 298 196C284 198 272 204 264 214C254 228 250 250 248 276C247 290 247 300 246 306C240 306 236 306 232 306C214 330 186 350 170 372C160 386 152 396 146 404Z",
  negliges:
    "M150 426C124 402 96 362 91 314C85 258 91 200 121 152C190 146 250 142 306 138C312 160 310 184 304 200C290 204 276 210 268 222C258 238 254 262 252 290C251 300 251 308 250 316C240 318 230 320 222 322C204 344 186 366 172 390C164 404 158 414 150 426Z",
} as const;

const BEARD = {
  taille:
    "M232 304L250 304C262 322 284 336 312 338C322 338 330 332 340 330C346 334 346 340 342 344C336 344 334 350 336 354C344 360 346 380 336 396C322 414 296 418 276 418C262 400 246 372 240 346C236 330 234 316 232 304Z",
  pleine:
    "M230 300L250 300C264 322 286 334 312 336C322 336 330 330 342 328C350 334 350 342 344 346C338 348 336 352 338 356C352 368 358 400 346 424C330 444 300 446 280 440C262 416 244 380 238 350C234 332 232 316 230 300Z",
  negliges:
    "M228 296L250 296C264 322 286 334 312 334C324 334 332 328 346 326C354 334 354 344 346 348C340 350 338 354 340 358C358 372 366 410 352 440C334 464 300 466 278 458C258 428 240 386 234 352C230 332 229 314 228 296Z",
} as const;

const MOUSTACHE = "M320 334C328 330 338 327 345 329C348 335 346 341 339 343C332 343 325 340 320 334Z";

/** Hauteur (y) où le fondu devient invisible */
const FADE_TOP: Record<ProfilParams["fade"], number> = {
  aucun: 480,
  taper: 480,
  bas: 244,
  moyen: 200,
  haut: 158,
};

export const fadeGuideY = (fade: ProfilParams["fade"]) => FADE_TOP[fade];

interface Props extends ProfilParams {
  className?: string;
  title?: string;
  /** Repères rouges (hauteur du fondu) — configurateur */
  guides?: boolean;
  /** Cape de coupe en bas */
  cape?: boolean;
  /** Vapeur de serviette chaude (rasage) */
  vapeur?: boolean;
}

export function ProfilTete({
  fade,
  skin,
  dessus,
  barbe,
  moustache,
  negliges,
  trace,
  className,
  title,
  guides = false,
  cape = true,
  vapeur = false,
}: Props) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:«»]/g, "");
  const t = reduce ? { duration: 0 } : { duration: 0.7, ease: ease.outCut };

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
          <motion.rect
            x="0"
            width="400"
            height="340"
            fill={`url(#fg-${uid})`}
            initial={false}
            animate={{ y: fadeVisible ? fadeTop : 480, opacity: fadeVisible ? 1 : 0 }}
            transition={t}
          />
          <motion.g initial={false} animate={{ opacity: fade === "taper" ? 1 : 0 }} transition={t}>
            <ellipse cx="150" cy="412" rx="46" ry="40" fill={`url(#tp-${uid})`} />
            <ellipse cx="244" cy="312" rx="22" ry="34" fill={`url(#tp-${uid})`} />
          </motion.g>
        </mask>
        <clipPath id={`k-${uid}`}>
          <motion.path initial={false} animate={{ d: topPath }} transition={t} />
        </clipPath>
      </defs>

      {title ? <title>{title}</title> : null}

      {/* Peau */}
      <path d={HEAD} fill="var(--paper, #f2ede4)" />

      {/* Cheveux : côtés + dessus, masqués par le dégradé */}
      <g mask={`url(#m-${uid})`}>
        <motion.path initial={false} animate={{ d: sidesPath }} transition={t} fill="currentColor" fillOpacity="0.14" />
        <motion.path initial={false} animate={{ d: sidesPath }} transition={t} fill={`url(#h-${uid})`} />
      </g>
      <motion.path initial={false} animate={{ d: topPath }} transition={t} fill="currentColor" fillOpacity="0.2" />
      <motion.path initial={false} animate={{ d: topPath }} transition={t} fill={`url(#t-${uid})`} />
      {/* Mèches : lignes de flux, découpées par la forme du dessus */}
      <g clipPath={`url(#k-${uid})`} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M110 150C160 110 240 80 350 110" />
        <path d="M118 132C170 96 250 70 356 92" />
        <path d="M130 116C190 80 260 60 350 74" />
        <path d="M150 100C200 70 270 50 340 58" />
        <path d="M200 146C240 120 290 110 352 126" />
      </g>

      {/* Trace au rasoir */}
      {trace ? (
        <path d="M140 232C170 222 200 220 236 226" fill="none" stroke="var(--paper, #f2ede4)" strokeWidth="3.2" strokeLinecap="round" />
      ) : null}

      {/* Barbe */}
      {beardPath ? (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t}>
          <motion.path initial={false} animate={{ d: beardPath }} transition={t} fill="currentColor" fillOpacity="0.16" />
          <motion.path initial={false} animate={{ d: beardPath }} transition={t} fill={`url(#b-${uid})`} />
        </motion.g>
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
      {guides ? (
        <motion.g
          initial={false}
          animate={{ y: fadeVisible ? fadeTop - 244 : 0, opacity: fadeVisible ? 1 : 0 }}
          transition={t}
          style={{ color: "var(--color-rouge)" }}
        >
          <line x1="14" y1="244" x2="96" y2="244" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="98" cy="244" r="2.5" fill="currentColor" />
          <text x="14" y="236" fill="currentColor" fontSize="11" letterSpacing="1.2" fontFamily="var(--font-sans)" fontWeight="600">
            FONDU
          </text>
        </motion.g>
      ) : null}
    </svg>
  );
}
