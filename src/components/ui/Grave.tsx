"use client";

/**
 * Texte gravé : le contour est tracé au burin (stroke-dashoffset), puis
 * l'encre remplit la gravure. Utilisé pour les noms des barbiers.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotionPref } from "@/hooks/useMedia";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface Props {
  text: string;
  className?: string;
  /** Classe CSS appliquée au <text> (couleur via fill/stroke currentColor) */
  as?: "h2" | "h3" | "p";
  delay?: number;
}

export function Grave({ text, className, as: Tag = "h3", delay = 0 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState({ x: 0, y: -80, w: text.length * 48, h: 100 });
  const [vu, setVu] = useState(false);
  const reduce = useReducedMotionPref();
  const go = vu || reduce;

  useIso(() => {
    const t = textRef.current;
    if (!t) return;
    const measure = () => {
      const b = t.getBBox();
      if (b.width) setBox({ x: b.x - 2, y: b.y - 2, w: b.width + 4, h: b.height + 4 });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
  }, [text]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVu(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <svg
        ref={svgRef}
        aria-hidden
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        className="block h-[1em] w-auto overflow-visible"
        style={{ aspectRatio: `${box.w} / ${box.h}` }}
      >
        <text
          ref={textRef}
          x="0"
          y="0"
          fontSize="100"
          className="font-display"
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"wdth" 112',
            fontWeight: 800,
            fill: "currentColor",
            fillOpacity: go ? 1 : 0,
            stroke: "currentColor",
            strokeWidth: 0.8,
            strokeDasharray: 900,
            strokeDashoffset: go ? 0 : 900,
            transition: `stroke-dashoffset 1.6s cubic-bezier(0.45,0.05,0.25,1) ${delay}ms, fill-opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay + 1100}ms`,
          }}
        >
          {text}
        </text>
      </svg>
    </Tag>
  );
}
