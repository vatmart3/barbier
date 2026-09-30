"use client";

/**
 * HERO — bannière de salon : texte à gauche (sur-titre or, grand titre serif
 * en deux tons, bouton or), tondeuse éclairée à droite. En sortant du hero,
 * le sabot s'enlève, la tondeuse s'allume et pivote. 3D chargée en différé, SVG en attendant.
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Bouton } from "@/components/ui/Bouton";
import { IconCalendrier } from "@/components/ui/Icons";
import { TondeuseSVG } from "@/components/illustrations/TondeuseSVG";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/cn";
import { heroState } from "./heroState";

const TondeuseScene = dynamic(() => import("@/components/three/TondeuseScene"), { ssr: false });

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

  // Pointeur → tondeuse
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
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
              heroState.p = Math.min(1, self.progress * 1.6);
            },
          },
        });
        tl.to("[data-objet-svg]", { rotate: 0, scale: 1.1, duration: 0.6, ease: "power2.inOut" }, 0);
        return () => {
          heroState.p = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div id="hero" ref={root} className="nuit relative overflow-hidden bg-charbon text-creme">
      {/* Lumière chaude côté tondeuse, comme un projecteur de salon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_72%_55%,rgb(214_180_125/0.16),transparent_70%),radial-gradient(ellipse_80%_70%_at_75%_50%,rgb(255_255_255/0.05),transparent_70%)]"
      />
      <div className="container-page relative grid min-h-[max(40rem,92svh)] items-center gap-6 pb-16 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-2 lg:pb-24">
        <div className="relative z-10 max-w-2xl">
          <p data-hero-in style={{ ["--i" as string]: 0 }} className="text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-ambre">
            Style <span aria-hidden>•</span> Précision <span aria-hidden>•</span> Caractère
          </p>
          <h1 className="mt-6 text-[clamp(2.75rem,1.6rem+4.2vw,5.25rem)] leading-[1.04]">
            <span className="block">Votre dégradé,</span>
            <span className="metal block whitespace-nowrap">notre obsession.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-creme-2">
            Réservez en une minute et prenez place dans l&apos;un des trois fauteuils de la Grand&apos;Rue, à Sète. Fade, taper, barbe au
            coupe-chou.
          </p>
          <div data-hero-in style={{ ["--i" as string]: 2 }} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Bouton href="#reserver-express" size="lg" iconEnd={<IconCalendrier size={18} />}>
              Réserver maintenant
            </Bouton>
            <Link href="/coupes" className="inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-medium text-creme-2 hover:text-creme">
              Voir les coupes <span aria-hidden>›</span>
            </Link>
          </div>
        </div>

        {/* La tondeuse : SVG immédiat, 3D en surcouche quand prête */}
        <div data-objet className="entree-objet relative h-[34svh] min-h-60 lg:h-[64svh]">
          <div
            data-objet-svg
            className={cn(
              "absolute left-1/2 top-1/2 w-[92%] max-w-[640px] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] transition-opacity duration-700",
              ready3d && "opacity-0",
            )}
          >
            <TondeuseSVG className="w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.7)]" />
          </div>
          {load3d ? (
            <div className={cn("pointer-events-none absolute inset-x-0 -inset-y-16 transition-opacity lg:-inset-x-10 duration-700", ready3d ? "opacity-100" : "opacity-0")}>
              <TondeuseScene active={active} centre onReady={() => setReady3d(true)} />
            </div>
          ) : null}
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0f0f0f]" />
    </div>
  );
}
