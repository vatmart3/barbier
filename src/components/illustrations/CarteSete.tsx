/**
 * Carte de Sète dessinée (pas d'iframe, pas de cookie tiers) : étang de Thau,
 * canal royal, Mont Saint-Clair en courbes de niveau (comme des traces de
 * tondeuse), Méditerranée. Les tracés se dessinent à l'entrée (CSS pur).
 */
import type { CSSProperties } from "react";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function CarteSete({ title }: { title: string }) {
  const contours = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 600 520" role="img" aria-label={title} className="h-auto w-full" data-reveal="carte">
      <title>{title}</title>
      {/* Étang de Thau (nord-ouest) */}
      <path data-trace pathLength={1} style={i(0)} d="M0 0H330C300 40 250 60 190 70C120 82 60 110 0 150Z" fill="var(--color-charbon-2)" stroke="var(--color-acier)" strokeWidth="1" />
      <text x="24" y="44" fill="var(--color-acier)" fontSize="11" letterSpacing="2">
        ÉTANG DE THAU
      </text>

      {/* Méditerranée (sud-est) */}
      <path data-trace pathLength={1} style={i(1)} d="M600 250C540 300 480 330 420 390C370 440 330 480 300 520H600Z" fill="var(--color-charbon-2)" stroke="var(--color-acier)" strokeWidth="1" />
      <text x="440" y="480" fill="var(--color-acier)" fontSize="11" letterSpacing="2">
        MÉDITERRANÉE
      </text>

      {/* Mont Saint-Clair : courbes de niveau */}
      <g fill="none" stroke="var(--color-acier)" strokeWidth="0.8" opacity="0.7">
        {contours.map((n) => (
          <ellipse key={n} data-trace pathLength={1} style={i(2 + n * 0.4)} cx="120" cy="360" rx={20 + n * 16} ry={14 + n * 12} transform="rotate(-18 120 360)" />
        ))}
      </g>
      <text x="62" y="470" fill="var(--color-acier)" fontSize="11" letterSpacing="2">
        MONT SAINT-CLAIR
      </text>

      {/* Canal royal */}
      <path data-trace pathLength={1} style={i(3)} d="M370 40C372 120 368 200 380 280C390 350 420 390 460 420" fill="none" stroke="var(--color-acier-clair)" strokeWidth="6" strokeOpacity="0.25" />
      <path data-trace pathLength={1} style={i(3)} d="M370 40C372 120 368 200 380 280C390 350 420 390 460 420" fill="none" stroke="var(--color-acier-clair)" strokeWidth="1" />
      <text x="388" y="150" fill="var(--color-acier)" fontSize="10" letterSpacing="2" transform="rotate(88 388 150)">
        CANAL ROYAL
      </text>

      {/* Rues */}
      <g fill="none" stroke="var(--color-creme)" strokeWidth="1" opacity="0.35">
        <path data-trace pathLength={1} style={i(4)} d="M220 230L520 210" />
        <path data-trace pathLength={1} style={i(4.3)} d="M240 290L500 270" />
        <path data-trace pathLength={1} style={i(4.6)} d="M300 150L320 400" />
        <path data-trace pathLength={1} style={i(4.9)} d="M200 180L360 330" />
        <path data-trace pathLength={1} style={i(5.2)} d="M430 120L450 330" />
      </g>
      {/* Grand'Rue en surbrillance */}
      <path data-trace pathLength={1} style={i(5.5)} d="M250 262L352 250" fill="none" stroke="var(--color-creme)" strokeWidth="2.5" />
      <text x="232" y="284" fill="var(--color-creme)" fontSize="10" letterSpacing="1.5">
        GRAND&apos;RUE
      </text>

      {/* Repères */}
      <g fill="var(--color-acier-clair)" fontSize="10" letterSpacing="1.5">
        <rect x="402" y="232" width="8" height="8" />
        <text x="414" y="240">LES HALLES</text>
        <rect x="392" y="70" width="8" height="8" />
        <text x="404" y="78">GARE</text>
      </g>

      {/* Le salon */}
      <g data-epingle>
        <circle cx="330" cy="252" r="22" fill="var(--color-rouge)" opacity="0.18" />
        <circle cx="330" cy="252" r="7" fill="var(--color-rouge)" />
        <line x1="330" y1="252" x2="330" y2="196" stroke="var(--color-rouge)" strokeWidth="1.5" />
        <rect x="330" y="176" width="92" height="22" rx="11" fill="var(--color-rouge)" />
        <text x="338" y="191" fill="#ffffff" fontSize="11" fontWeight="700" letterSpacing="2">
          DÉGRADÉ
        </text>
      </g>
    </svg>
  );
}
