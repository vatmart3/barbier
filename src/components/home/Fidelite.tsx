"use client";

/**
 * Carte de fidélité (démo) : les tampons tombent au rythme du scroll, puis
 * on peut tamponner soi-même jusqu'à la 10ᵉ coupe offerte.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { fidelite } from "@/data/fidelite";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
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
  const [auto, setAuto] = useState(0);
  const [extra, setExtra] = useState(0);

  // Les tampons tombent au rythme du scroll (de l'entrée de la section à son milieu)
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const debut = vh * 0.8;
      const fin = vh * 0.5 - r.height / 2;
      const v = Math.min(1, Math.max(0, (debut - r.top) / (debut - fin)));
      const n = Math.round(v * fidelite.tamponsDemo);
      setAuto((prev) => Math.max(prev, n));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-rouge" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div data-reveal="monte">
          <div className="relative mx-auto max-w-xl papier rotate-[-2deg] rounded-[1.75rem] border border-rouge/30 bg-creme p-5 text-charbon shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] sm:p-8">
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
                    {filled ? (
                      <span className="tampon absolute -inset-1 text-rouge" style={{ "--r": `${ROT[i]}deg` } as CSSProperties}>
                        <Tampon n={i + 1} />
                      </span>
                    ) : null}
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
                className="min-h-11 rounded-full border border-charbon px-5 text-sm font-semibold transition-colors hover:bg-charbon hover:text-creme active:scale-[0.97]"
              >
                {complet ? "Nouvelle carte" : "Tamponner"}
              </button>
            </div>
            {complet ? (
              <p aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span
                  className="tampon block border-4 border-rouge px-5 py-2 font-display text-6xl text-rouge"
                  style={{ "--r": "-12deg" } as CSSProperties}
                >
                  Offerte
                </span>
              </p>
            ) : null}
          </div>
          </div>
          <p className="mt-6 text-center text-xs text-acier">Démo interactive. Au salon, la carte est en carton épais, et on se souvient de vous.</p>
        </div>
      </div>
    </section>
  );
}
