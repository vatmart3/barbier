"use client";

/**
 * La tondeuse en vitrine (section « Les coupes ») : SVG immédiat, 3D chargée
 * quand le bloc approche de l'écran. En le traversant au scroll, la tondeuse
 * s'allume (la lame vibre) et pivote pour montrer la denture.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TondeuseSVG } from "@/components/illustrations/TondeuseSVG";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/cn";
import { heroState } from "./heroState";

const TondeuseScene = dynamic(() => import("@/components/three/TondeuseScene"), { ssr: false });

export function TondeuseVitrine({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const [load3d, setLoad3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [active, setActive] = useState(false);

  // 3D chargée à l'approche, rendue seulement quand visible
  useEffect(() => {
    const el = root.current;
    if (!el || tier !== "high") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setLoad3d(true);
        setActive(e.isIntersecting);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tier]);

  // Pointeur → légère orientation
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroState.px = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "bottom 25%",
            scrub: 0.5,
            onUpdate: (self) => {
              heroState.p = self.progress;
            },
          },
        });
        return () => {
          heroState.p = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={cn("relative", className)}>
      <div className={cn("absolute inset-0 grid place-items-center transition-opacity duration-700", ready3d && "opacity-0")}>
        <TondeuseSVG className="w-[88%] max-w-[560px] -rotate-[10deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]" />
      </div>
      {load3d ? (
        <div className={cn("pointer-events-none absolute -inset-y-10 inset-x-0 transition-opacity duration-700", ready3d ? "opacity-100" : "opacity-0")}>
          <TondeuseScene active={active} centre onReady={() => setReady3d(true)} />
        </div>
      ) : null}
    </div>
  );
}
