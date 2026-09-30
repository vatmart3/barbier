"use client";

/**
 * Avant / après — 4 réalisations, curseur en forme de lame.
 * Glisser (souris / doigt), ou clavier : flèches, Page préc./suiv., Début/Fin.
 */
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { realisations } from "@/data/realisations";
import { getBarbier } from "@/data/barbiers";
import { ProfilTete } from "@/components/illustrations/ProfilTete";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { ease, transition } from "@/design/motion";
import { cn } from "@/lib/cn";

function Lame() {
  return (
    <svg viewBox="0 0 28 120" className="h-28 w-7 drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]" aria-hidden>
      <defs>
        <linearGradient id="lame-acier" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa0a6" />
          <stop offset="0.45" stopColor="#f2ede4" />
          <stop offset="1" stopColor="#6e757b" />
        </linearGradient>
      </defs>
      {/* Lame de rasoir, tranchant à gauche, dos à droite */}
      <path d="M8 6C14 2 22 4 22 10V104C22 112 16 116 10 114C6 112 4 106 4 100L6 14C6 10 6 8 8 6Z" fill="url(#lame-acier)" stroke="#111" strokeWidth="1" />
      <path d="M5 16L5 98" stroke="#fff" strokeWidth="1" opacity="0.8" />
      <path d="M14 30v60" stroke="#111" strokeOpacity="0.25" strokeWidth="6" strokeLinecap="round" />
      <circle cx="14" cy="60" r="2.2" fill="#c8102e" />
    </svg>
  );
}

export function AvantApres() {
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState(100);
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inView = useInView(stage, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const r = realisations[index];
  const barbier = getBarbier(r.barbier);

  // Révélation : la lame balaie de droite au centre à l'entrée
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const duree = reduce ? 1 : 1200;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duree);
      const e = 1 - Math.pow(1 - k, 4);
      setPos(100 - 50 * e);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  const fromPointer = useCallback((clientX: number) => {
    const el = stage.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 };
    if (e.key in map) {
      e.preventDefault();
      setPos((p) => Math.min(100, Math.max(0, p + map[e.key])));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  return (
    <section aria-labelledby="aa-titre" className="bg-charbon py-(--spacing-section) text-creme">
      <div className="container-page grid-page gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <Etiquette n="04" className="text-acier">
            Avant / après
          </Etiquette>
          <Lignes id="aa-titre" className="mt-6 text-d1" lines={["Le miroir", "ne ment pas."]} />
          <p className="mt-6 max-w-sm text-creme/80">Quatre passages au fauteuil, dessinés d&apos;après nos fiches. Faites glisser la lame.</p>

          <ol className="mt-10 border-t border-creme/15" aria-label="Réalisations">
            {realisations.map((x, i) => (
              <li key={x.id} className="border-b border-creme/15">
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setPos(50);
                  }}
                  aria-pressed={i === index}
                  className={cn(
                    "group flex min-h-14 w-full items-center gap-4 py-3 text-left transition-colors",
                    i === index ? "text-creme" : "text-acier hover:text-creme",
                  )}
                >
                  <span className="tabular text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm">{x.titre}</span>
                  <span aria-hidden className={cn("h-px bg-rouge transition-all duration-500", i === index ? "w-10" : "w-0 group-hover:w-5")} />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <motion.div
            ref={stage}
            className="relative aspect-[5/6] w-full touch-pan-y select-none overflow-hidden bg-creme text-charbon sm:aspect-[4/3]"
            style={{ ["--paper" as string]: "var(--color-creme)" }}
            initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={transition(reduce, { duration: 1.1, ease: ease.blade, opacity: { duration: 0.3 } })}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              fromPointer(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {/* Après (dessous) */}
            <div className="absolute inset-0 flex items-end justify-center">
              {r.photos ? (
                <Image src={r.photos.apres} alt={`${r.photos.alt} — après`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover grayscale" />
              ) : (
                <ProfilTete {...r.apres} title={`Après : ${r.titre}, réalisé par ${barbier?.prenom} chez Dégradé à Sète`} className="h-[92%] w-auto" />
              )}
            </div>
            {/* Avant (dessus, rogné par la lame) */}
            <div className="absolute inset-0 flex items-end justify-center bg-creme-2" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              {r.photos ? (
                <Image src={r.photos.avant} alt={`${r.photos.alt} — avant`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover grayscale" />
              ) : (
                <ProfilTete {...r.avant} title={`Avant : ${r.titre}`} className="h-[92%] w-auto" />
              )}
            </div>

            <span className="eyebrow absolute left-4 top-4 bg-charbon px-2 py-1 text-creme">Avant</span>
            <span className="eyebrow absolute right-4 top-4 bg-rouge px-2 py-1 text-creme">Après</span>

            {/* La lame */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Comparer avant et après"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)} % de l'image avant visible`}
              onKeyDown={onKey}
              className="absolute inset-y-0 z-10 flex w-12 -translate-x-1/2 cursor-ew-resize items-center justify-center focus-visible:outline-offset-[-4px]"
              style={{ left: `${pos}%` }}
            >
              <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-charbon" />
              <span className="relative">
                <Lame />
              </span>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="font-display text-3xl leading-none">{r.titre}</p>
              <p className="mt-2 max-w-lg text-sm text-creme/75">{r.note}</p>
            </div>
            <p className="eyebrow tabular text-acier">
              {barbier?.prenom} · {r.duree} min
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
