"use client";

/**
 * Compteur mécanique : chaque chiffre est un rouleau 0-9 qui tourne jusqu'à sa
 * valeur. Le HTML serveur affiche la valeur finale (SEO, sans JS). Hors écran
 * au chargement, les rouleaux sont remis à zéro puis tournent à l'entrée.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  value: string | number;
  className?: string;
  /** Délai de départ (ms) */
  delay?: number;
  /** Durée de base d'un rouleau (ms) */
  duration?: number;
}

export function Compteur({ value, className, delay = 0, duration = 900 }: Props) {
  const text = String(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // déjà visible : on ne rejoue pas
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => setArmed(false));
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = text.split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let di = 0;

  return (
    <span ref={ref} className={cn("relative inline-flex tabular overflow-hidden leading-none", className)}>
      <span className="sr-only">{text}</span>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <span key={`s${i}`} aria-hidden className="inline-block">
              {c === " " ? " " : c}
            </span>
          );
        }
        const n = Number(c);
        const order = digitCount - 1 - di++;
        return (
          <span key={`d${chars.length - i}`} aria-hidden className="relative inline-block h-[1em] overflow-hidden">
            <span className="invisible">0</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col"
              style={{
                transform: `translateY(${armed ? 0 : -n * 10}%)`,
                transition: armed ? "none" : `transform ${duration + order * 140}ms cubic-bezier(0.7, 0, 0.2, 1) ${delay + order * 60}ms`,
              }}
            >
              {"0123456789".split("").map((d) => (
                <span key={d} className="block h-[1em] text-center">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
