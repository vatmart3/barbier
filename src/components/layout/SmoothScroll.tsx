"use client";

/**
 * Lenis (défilement doux) synchronisé avec le ticker GSAP / ScrollTrigger.
 * Désactivé si prefers-reduced-motion : défilement natif.
 */
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.2, autoRaf: false });
      instance.on("scroll", ScrollTrigger.update);
      tick = (t: number) => instance?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };
    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };
    if (!mql.matches) start();
    const onChange = () => (mql.matches ? stop() : start());
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // Nouvelle page : haut de page immédiat, puis recalcul des déclencheurs
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
