"use client";

/**
 * Carte de Sète dessinée (pas d'iframe, pas de cookie tiers) : étang de Thau,
 * canal royal, Mont Saint-Clair en courbes de niveau (comme des traces de
 * tondeuse), Méditerranée. Les tracés se dessinent à l'entrée.
 */
import { motion, useReducedMotion } from "motion/react";
import { ease, transition } from "@/design/motion";

const draw = (i: number, reduce: boolean | null) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  transition: transition(reduce, { duration: 1.6, ease: ease.comb, delay: 0.1 + i * 0.08 }),
});

export function CarteSete({ title }: { title: string }) {
  const reduce = useReducedMotion();
  const v = { once: true, margin: "0px 0px -15% 0px" } as const;
  const contours = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 600 520" role="img" aria-label={title} className="h-auto w-full">
      <title>{title}</title>
      {/* Étang de Thau (nord-ouest) */}
      <motion.path
        d="M0 0H330C300 40 250 60 190 70C120 82 60 110 0 150Z"
        fill="var(--color-charbon-2)"
        stroke="var(--color-acier)"
        strokeWidth="1"
        viewport={v}
        {...draw(0, reduce)}
      />
      <text x="24" y="44" className="eyebrow" fill="var(--color-acier)" fontSize="11" letterSpacing="2">
        ÉTANG DE THAU
      </text>

      {/* Méditerranée (sud-est) */}
      <motion.path
        d="M600 250C540 300 480 330 420 390C370 440 330 480 300 520H600Z"
        fill="var(--color-charbon-2)"
        stroke="var(--color-acier)"
        strokeWidth="1"
        viewport={v}
        {...draw(1, reduce)}
      />
      <text x="440" y="480" fill="var(--color-acier)" fontSize="11" letterSpacing="2">
        MÉDITERRANÉE
      </text>

      {/* Mont Saint-Clair : courbes de niveau */}
      <g fill="none" stroke="var(--color-acier)" strokeWidth="0.8" opacity="0.7">
        {contours.map((i) => (
          <motion.ellipse
            key={i}
            cx="120"
            cy="360"
            rx={20 + i * 16}
            ry={14 + i * 12}
            transform={`rotate(-18 120 360)`}
            viewport={v}
            {...draw(2 + i * 0.4, reduce)}
          />
        ))}
      </g>
      <text x="62" y="470" fill="var(--color-acier)" fontSize="11" letterSpacing="2">
        MONT SAINT-CLAIR
      </text>

      {/* Canal royal + canal de Sète */}
      <motion.path d="M370 40C372 120 368 200 380 280C390 350 420 390 460 420" fill="none" stroke="var(--color-acier-clair)" strokeWidth="6" strokeOpacity="0.25" viewport={v} {...draw(3, reduce)} />
      <motion.path d="M370 40C372 120 368 200 380 280C390 350 420 390 460 420" fill="none" stroke="var(--color-acier-clair)" strokeWidth="1" viewport={v} {...draw(3, reduce)} />
      <text x="388" y="150" fill="var(--color-acier)" fontSize="10" letterSpacing="2" transform="rotate(88 388 150)">
        CANAL ROYAL
      </text>

      {/* Rues */}
      <g fill="none" stroke="var(--color-creme)" strokeWidth="1" opacity="0.35">
        <motion.path d="M220 230L520 210" viewport={v} {...draw(4, reduce)} />
        <motion.path d="M240 290L500 270" viewport={v} {...draw(4.3, reduce)} />
        <motion.path d="M300 150L320 400" viewport={v} {...draw(4.6, reduce)} />
        <motion.path d="M200 180L360 330" viewport={v} {...draw(4.9, reduce)} />
        <motion.path d="M430 120L450 330" viewport={v} {...draw(5.2, reduce)} />
      </g>
      {/* Grand'Rue en surbrillance */}
      <motion.path d="M250 262L352 250" fill="none" stroke="var(--color-creme)" strokeWidth="2.5" viewport={v} {...draw(5.5, reduce)} />
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
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={v}
        transition={transition(reduce, { duration: 0.5, ease: ease.thud, delay: 1.4 })}
        style={{ transformOrigin: "330px 252px" }}
      >
        <circle cx="330" cy="252" r="22" fill="var(--color-rouge)" opacity="0.18" />
        <circle cx="330" cy="252" r="7" fill="var(--color-rouge)" />
        <line x1="330" y1="252" x2="330" y2="196" stroke="var(--color-rouge)" strokeWidth="1.5" />
        <rect x="330" y="176" width="92" height="22" fill="var(--color-rouge)" />
        <text x="338" y="191" fill="var(--color-creme)" fontSize="11" fontWeight="700" letterSpacing="2">
          DÉGRADÉ
        </text>
      </motion.g>
    </svg>
  );
}
