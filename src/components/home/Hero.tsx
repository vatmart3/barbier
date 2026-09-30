"use client";

/**
 * HERO — page produit. Fond noir, titre centré, rasoir coupe-chou présenté
 * comme un objet : au scroll, la lame s'ouvre et l'objet pivote doucement
 * pendant que le texte s'efface. 3D chargée en différé, SVG en attendant.
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Bouton } from "@/components/ui/Bouton";
import { RasoirSVG } from "@/components/illustrations/RasoirSVG";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/cn";
import { heroState } from "./heroState";

const RasoirScene = dynamic(() => import("@/components/three/RasoirScene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const [load3d, setLoad3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [active, setActive] = useState(true);

  // 3D : chargée après la première interaction ou 1,2 s d'inactivité
  useEffect(() => {
    if (tier !== "high") return;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setLoad3d(true);
    };
    const events = ["pointermove", "touchstart", "wheel", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const t = window.setTimeout(go, 1200);
    return () => {
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, go));
    };
  }, [tier]);

  // Pointeur → rasoir
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroState.px = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Rendu 3D suspendu quand le hero est hors écran
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              heroState.p = self.progress;
            },
          },
        });
        tl.to("[data-texte]", { opacity: 0, y: -60, duration: 0.35 }, 0)
          .to("[data-scroll-hint]", { opacity: 0, duration: 0.1 }, 0)
          .to("[data-rasoir-svg]", { rotate: 0, scale: 1.2, yPercent: -30, duration: 0.6, ease: "power2.inOut" }, 0);
        return () => {
          heroState.p = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div id="hero" ref={root} className="nuit relative h-[190svh] bg-charbon text-creme motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static">
        {/* Halo de lumière sous l'objet */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_55%_45%_at_50%_70%,rgb(255_255_255/0.09),transparent_70%)]" />

        <div data-texte className="container-page relative z-10 flex flex-col items-center pt-[calc(var(--header-h)+7svh)] text-center">
          <h1 className="flex flex-col items-center">
            <span className="text-lg font-semibold text-ambre md:text-xl">
              Barbier à Sète
            </span>
            <span className="metal mt-1 block text-[clamp(3.6rem,2rem+8vw,8.5rem)] leading-[1.02] tracking-[-0.035em]">
              Dégradé.
            </span>
          </h1>
          <p data-hero-in style={{ ["--i" as string]: 2 }} className="mt-4 max-w-xl text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] leading-snug text-creme-2">
            Fade, taper, barbe au coupe-chou.
            <br className="hidden sm:block" /> Trois fauteuils, Grand&apos;Rue.
          </p>
          <div data-hero-in style={{ ["--i" as string]: 3 }} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Bouton href="/reserver" size="lg">
              Réserver
            </Bouton>
            <Link href="/coupes" className="inline-flex min-h-11 items-center gap-1 text-[1.0625rem] text-ambre hover:underline">
              Voir les coupes <span aria-hidden>›</span>
            </Link>
          </div>
        </div>

        {/* L'objet : SVG immédiat, 3D en surcouche quand prête */}
        <div data-rasoir className="entree-objet pointer-events-none absolute inset-x-0 bottom-0 top-[42%] motion-reduce:top-auto motion-reduce:h-[40svh]">
          <div
            data-rasoir-svg
            className={cn(
              "absolute left-1/2 top-[45%] w-[82vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] transition-opacity duration-700 md:w-[52vw]",
              ready3d && "opacity-0",
            )}
          >
            <RasoirSVG className="w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.7)]" />
          </div>
        </div>
        {load3d ? (
          <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-700", ready3d ? "opacity-100" : "opacity-0")}>
            <RasoirScene active={active} onReady={() => setReady3d(true)} />
          </div>
        ) : null}

        <p aria-hidden data-scroll-hint className="absolute inset-x-0 bottom-5 z-10 text-center text-xs text-acier motion-reduce:hidden" data-hero-in style={{ ["--i" as string]: 4 }}>
          Faites défiler, la lame s&apos;ouvre
        </p>
      </div>
    </div>
  );
}
