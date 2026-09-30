"use client";

/**
 * Carte de fidélité (démo) : les tampons tombent au rythme du scroll, puis
 * on peut tamponner soi-même jusqu'à la 10ᵉ coupe offerte.
 */
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { fidelite } from "@/data/fidelite";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { ease, transition } from "@/design/motion";
import { cn } from "@/lib/cn";

const ROT = [-8, 5, -3, 9, -6, 2, -10, 6, -4, 0];

function Tampon({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <path id={`arc-${n}`} d="M50 50m-33 0a33 33 0 1 1 66 0a33 33 0 1 1 -66 0" />
      </defs>
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
      <text fontSize="11" fontWeight="700" letterSpacing="3" fill="currentColor" fontFamily="var(--font-sans)">
        <textPath href={`#arc-${n}`}>DÉGRADÉ · SÈTE · DÉGRADÉ ·</textPath>
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="30" fill="currentColor" fontFamily="var(--font-display)" fontWeight="800">
        {n}
      </text>
    </svg>
  );
}

export function Fidelite() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [auto, setAuto] = useState(0);
  const [extra, setExtra] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "center 0.5"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.round(Math.min(1, Math.max(0, v)) * fidelite.tamponsDemo);
    setAuto((prev) => (prev === n ? prev : Math.max(prev, n)));
  });

  const total = Math.min(fidelite.cases, auto + extra);
  const complet = total >= fidelite.cases;

  return (
    <section ref={ref} aria-labelledby="fid-titre" className="overflow-hidden bg-charbon py-(--spacing-section) text-creme">
      <div className="container-page grid-page items-center gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <Etiquette n="06" className="text-acier">
            Fidélité
          </Etiquette>
          <Lignes id="fid-titre" className="mt-6 text-d2" lines={["Neuf coupes.", "La dixième", <span key="c" className="text-acier">est pour nous.</span>]} />
          <ul className="mt-8 space-y-2 text-sm text-creme/80">
            {fidelite.regles.map((r) => (
              <li key={r} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-rouge" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <motion.div
            className="relative mx-auto max-w-xl rotate-[-2deg] bg-creme p-5 text-charbon shadow-paper sm:p-8"
            initial={{ y: 60, rotate: -8, opacity: 0 }}
            whileInView={{ y: 0, rotate: -2, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={transition(reduce, { duration: 1, ease: ease.outCut })}
          >
            <div className="flex items-baseline justify-between border-b border-charbon/20 pb-3">
              <p className="font-display text-3xl leading-none">Dégradé</p>
              <p className="eyebrow text-acier-fonce">Carte n° 0427</p>
            </div>
            <ol className="mt-5 grid grid-cols-5 gap-2 sm:gap-3" aria-label={`Carte de fidélité : ${total} tampons sur ${fidelite.cases}`}>
              {Array.from({ length: fidelite.cases }, (_, i) => {
                const filled = i < total;
                const last = i === fidelite.cases - 1;
                return (
                  <li
                    key={i}
                    className={cn(
                      "relative aspect-square rounded-full border border-dashed",
                      last ? "border-rouge/60" : "border-charbon/25",
                    )}
                  >
                    {!filled ? (
                      <span className={cn("absolute inset-0 grid place-items-center text-xs tabular", last ? "text-rouge-fonce" : "text-charbon/35")}>
                        {last ? "offerte" : i + 1}
                      </span>
                    ) : null}
                    <AnimatePresence>
                      {filled ? (
                        <motion.span
                          className="absolute -inset-1 text-rouge mix-blend-multiply"
                          initial={{ scale: 1.9, opacity: 0, rotate: ROT[i] - 20 }}
                          animate={{ scale: 1, opacity: 0.92, rotate: ROT[i] }}
                          exit={{ opacity: 0 }}
                          transition={transition(reduce, { duration: 0.38, ease: ease.thud })}
                        >
                          <Tampon n={i + 1} />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-charbon/20 pt-4">
              <p className="text-sm" aria-live="polite">
                {complet ? (
                  <strong className="font-semibold text-rouge-fonce">Coupe offerte. Montrez la carte au comptoir.</strong>
                ) : (
                  <>
                    <strong className="tabular font-semibold">{fidelite.cases - total}</strong> coupe{fidelite.cases - total > 1 ? "s" : ""} avant la
                    gratuite.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => (complet ? (setExtra(0), setAuto(0)) : setExtra((e) => e + 1))}
                className="min-h-11 border border-charbon px-4 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-charbon hover:text-creme active:scale-[0.97]"
              >
                {complet ? "Nouvelle carte" : "Tamponner"}
              </button>
            </div>
            <AnimatePresence>
              {complet ? (
                <motion.p
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-rouge px-5 py-2 font-display text-6xl text-rouge mix-blend-multiply"
                  initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
                  animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.thud }}
                >
                  Offerte
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>
          <p className="mt-6 text-center text-xs text-acier">Démo interactive. Au salon, la carte est en carton épais, et on se souvient de vous.</p>
        </div>
      </div>
    </section>
  );
}
