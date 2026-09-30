"use client";

/**
 * Section épinglée à défilement horizontal (« le fauteuil pivote »).
 * Le contenu (panneaux) est rendu côté serveur et passé en enfants : seul ce
 * petit composant est hydraté. Repères optionnels dans les enfants :
 *  - [data-deg]    : affiche l'angle de pivot (0° → 180°)
 *  - [data-profil] : parallaxe à l'intérieur de son [data-panel]
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Media query sous laquelle l'épinglage est actif */
  media?: string;
  /** Aimantation sur N panneaux (N-1 intervalles) */
  snapPanels?: number;
  railClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Epingle({ children, className, trackClassName, media = "(prefers-reduced-motion: no-preference)", snapPanels, railClassName, ...aria }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const degs = section.current!.querySelectorAll<HTMLElement>("[data-deg]");
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            snap: snapPanels ? { snapTo: 1 / (snapPanels - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" } : undefined,
            onUpdate: (self) => {
              section.current?.style.setProperty("--pivot", String(self.progress));
              degs.forEach((d) => (d.textContent = `${Math.round(self.progress * 180)}°`));
            },
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-profil]", section.current).forEach((p) => {
          gsap.fromTo(
            p,
            { xPercent: 12, rotate: 3 },
            {
              xPercent: -12,
              rotate: -2,
              ease: "none",
              scrollTrigger: { trigger: p.closest("[data-panel]"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className={cn("relative overflow-hidden", className)} {...aria}>
      <div ref={track} className={trackClassName}>
        {children}
      </div>
      <div aria-hidden className={cn("pointer-events-none absolute inset-x-(--spacing-gutter) h-px bg-creme/15 motion-reduce:hidden", railClassName)}>
        <span className="absolute inset-y-0 left-0 w-full origin-left bg-rouge" style={{ transform: "scaleX(var(--pivot, 0))" }} />
      </div>
    </section>
  );
}
