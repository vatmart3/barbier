"use client";

/**
 * Carrousel natif : défilement horizontal du navigateur, aimanté carte par
 * carte (scroll-snap), avec deux boutons ronds. Tout le contenu est dans le
 * HTML et visible sans JS ; au doigt, au trackpad ou au clavier (flèches une
 * fois la liste sélectionnée).
 *
 * Les enfants sont des <li> : leur largeur se règle depuis l'appelant.
 * La première carte s'aligne sur la colonne du site, les suivantes
 * débordent jusqu'au bord de l'écran.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconChevron } from "./Icons";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  /** Nom accessible de la liste */
  label: string;
  className?: string;
  /** Couleur des boutons : sur fond clair (défaut) ou sombre */
  ton?: "clair" | "sombre";
}

export function Carrousel({ children, label, className, ton = "clair" }: Props) {
  const liste = useRef<HTMLUListElement>(null);
  const [bords, setBords] = useState({ debut: true, fin: false });

  useEffect(() => {
    const el = liste.current;
    if (!el) return;
    const maj = () => setBords({ debut: el.scrollLeft < 8, fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    maj();
    el.addEventListener("scroll", maj, { passive: true });
    window.addEventListener("resize", maj);
    return () => {
      el.removeEventListener("scroll", maj);
      window.removeEventListener("resize", maj);
    };
  }, []);

  const aller = useCallback((sens: 1 | -1) => {
    const el = liste.current;
    if (!el) return;
    const carte = el.querySelector("li");
    const pas = carte ? carte.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sens * pas, behavior: doux ? "smooth" : "auto" });
  }, []);

  const bouton = cn(
    "inline-flex size-11 items-center justify-center rounded-full transition-[background-color,opacity,transform] duration-200 active:scale-95 disabled:cursor-default disabled:opacity-35",
    ton === "clair" ? "bg-charbon-3 text-creme hover:bg-[#383838]" : "bg-white/12 text-white hover:bg-white/20",
  );

  return (
    <div className={className}>
      <ul
        ref={liste}
        aria-label={label}
        tabIndex={0}
        data-lenis-prevent-wheel
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-(--bord) pb-4 pt-1 [scroll-padding-inline:var(--bord)] focus-visible:outline-offset-4"
        style={{ ["--bord" as string]: "max(var(--spacing-gutter), calc((100% - 80rem) / 2 + var(--spacing-gutter)))" }}
      >
        {children}
      </ul>
      <div className="container-page mt-4 flex justify-end gap-3">
        <button type="button" className={bouton} onClick={() => aller(-1)} disabled={bords.debut} aria-label="Précédent">
          <IconChevron dir="gauche" size={20} />
        </button>
        <button type="button" className={bouton} onClick={() => aller(1)} disabled={bords.fin} aria-label="Suivant">
          <IconChevron size={20} />
        </button>
      </div>
    </div>
  );
}
