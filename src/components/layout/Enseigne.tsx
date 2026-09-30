"use client";

/**
 * Enseigne de barbier = indicateur de progression de la page.
 * SVG immédiat (fallback), remplacé par la version 3D si l'appareil le permet.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/cn";

const EnseigneScene = dynamic(() => import("@/components/three/EnseigneScene"), { ssr: false });

export function Enseigne({ className }: { className?: string }) {
  const progress = useRef(0);
  const svgRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const tier = useDeviceTier();
  const [load3d, setLoad3d] = useState(false);

  useScrollProgress((p) => {
    progress.current = p;
    svgRef.current?.style.setProperty("--p", String(p));
    const rounded = Math.round(p * 100);
    setPct((prev) => (prev === rounded ? prev : rounded));
  });

  // 3D chargée seulement après inactivité, et uniquement sur appareil capable
  useEffect(() => {
    if (tier !== "high") return;
    const t = window.setTimeout(() => setLoad3d(true), 2200);
    return () => window.clearTimeout(t);
  }, [tier]);

  return (
    <div
      className={cn("relative h-9 w-4 shrink-0", className)}
      role="progressbar"
      aria-label="Progression dans la page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div
        ref={svgRef}
        aria-hidden
        className={cn("absolute inset-0 flex flex-col items-center transition-opacity duration-500", load3d && "opacity-0")}
      >
        <span className="h-1 w-2.5 rounded-t-full bg-acier-clair" />
        <span
          className="relative w-3 flex-1 overflow-hidden rounded-full ring-1 ring-acier-clair/40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-58deg, var(--color-rouge) 0 4px, #ffffff 4px 6px, #9aa0a6 6px 10px, #ffffff 10px 12px)",
            backgroundSize: "100% 200%",
            backgroundPositionY: "calc(var(--p, 0) * 400px)",
          }}
        />
        <span className="h-1 w-2.5 rounded-b-full bg-acier-clair" />
      </div>
      {load3d ? (
        <div className="absolute -inset-x-3 -inset-y-1 animate-[fadein_0.6s_ease-out]" aria-hidden>
          <EnseigneScene progress={progress} />
        </div>
      ) : null}
    </div>
  );
}
