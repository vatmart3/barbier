"use client";

/** Mini-carrousel du hero : deux coupes à la fois, flèches cuivre. */
import Link from "next/link";
import { useState } from "react";
import { coupes } from "@/data/prestations";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { IconChevron } from "@/components/ui/Icons";

const PAR_PAGE = 2;

export function VitrineCoupes() {
  const pages = Math.ceil(coupes.length / PAR_PAGE);
  const [page, setPage] = useState(0);
  const visibles = coupes.slice(page * PAR_PAGE, page * PAR_PAGE + PAR_PAGE);
  const aller = (d: number) => setPage((p) => (p + d + pages) % pages);

  return (
    <div className="flex items-stretch" role="group" aria-label="Aperçu des coupes">
      <button type="button" onClick={() => aller(-1)} aria-label="Coupes précédentes" className="bg-rouge grid w-9 shrink-0 place-items-center text-white transition-[filter] hover:brightness-110">
        <IconChevron dir="gauche" size={18} />
      </button>
      <ul className="flex gap-1 bg-charbon/70 p-1 backdrop-blur-sm" aria-live="polite">
        {visibles.map((c) => (
          <li key={c.id} className="w-32 sm:w-36">
            <Link href={`/coupes#${c.id}`} className="group relative block overflow-hidden bg-charbon-2" style={{ ["--paper" as string]: "var(--color-charbon-2)" }}>
              <span className="block h-24 overflow-hidden text-creme">
                <ProfilStatique id={`vit-${c.id}`} {...c.profil} dessus={c.dessusPossibles.includes("court") ? "court" : c.dessusPossibles[0]} barbe="aucune" cape={false} className="mx-auto -mt-2 h-32 w-auto transition-transform duration-500 group-hover:scale-105" />
              </span>
              <span className="absolute inset-x-0 top-1 text-center font-display text-sm leading-none text-creme [font-variation-settings:'wdth'_125]">{c.nom}</span>
              <span className="block bg-charbon py-1 text-center text-[0.6875rem] tabular text-acier-clair">
                {c.prix} € · {c.duree} min
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => aller(1)} aria-label="Coupes suivantes" className="bg-rouge grid w-9 shrink-0 place-items-center text-white transition-[filter] hover:brightness-110">
        <IconChevron dir="droite" size={18} />
      </button>
    </div>
  );
}
