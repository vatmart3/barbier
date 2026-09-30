/**
 * « Au fauteuil » — galerie de vraies photos en mosaïque arrondie, avec une
 * tuile or pour réserver. Crédits CC BY affichés dessous (obligatoires).
 */
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { LICENCE, photos } from "@/data/galerie";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { cn } from "@/lib/cn";

/** Place de chaque photo dans la mosaïque (4 colonnes en grand écran, 2 sur mobile) */
const TUILES = [
  "col-span-2 row-span-2", // rasage
  "col-span-2", // salon d'époque
  "", // tondeuse
  "", // ciseaux
  "lg:col-span-2", // peigne
  "row-span-2", // serviette chaude (portrait)
  "lg:row-span-2", // atelier
];
/** Ordre d'affichage (le portrait passe avant pour remplir la grille sans trou) */
const ORDRE = [0, 1, 2, 3, 5, 4, 6];

export function Galerie({ ton = "clair", lienReserver = "#reserver-express" }: { ton?: "clair" | "sombre"; lienReserver?: string }) {
  return (
    <section aria-labelledby="galerie-titre" className={cn("py-(--spacing-section)", ton === "clair" ? "clair bg-charbon-2 text-creme" : "bg-charbon")}>
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <Etiquette>Au fauteuil</Etiquette>
            <Lignes id="galerie-titre" className="mt-4 text-d2" lines={["Des gestes,", <span key="b" className="text-acier">pas des filtres.</span>]} />
          </div>
          <p className="max-w-sm text-acier">La tondeuse, le peigne, la mousse et la serviette chaude : le métier comme il se pratique, au plus près.</p>
        </div>

        <ul className="mt-12 grid grid-flow-dense auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] lg:grid-cols-4 lg:gap-4">
          {ORDRE.map((i) => {
            const p = photos[i];
            return (
              <li key={p.src} className={cn("group relative overflow-hidden rounded-[1.5rem] bg-charbon-3", TUILES[i])} data-reveal="monte">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-(--ease-out-cut) group-hover:scale-[1.04]"
                  style={{ objectPosition: p.cadrage }}
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {p.legende}
                </span>
              </li>
            );
          })}
          <li className="col-span-2 flex flex-col justify-between rounded-[1.5rem] bg-rouge p-6 text-sur-accent sm:p-7">
            <p className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] leading-tight">Votre tour ?</p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="max-w-[16rem] text-sm">Trois fauteuils, un créneau libre dès aujourd&apos;hui ou demain.</p>
              <Link
                href={lienReserver}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sur-accent px-5 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-rouge transition-[filter] hover:brightness-125"
              >
                Réserver <span aria-hidden>›</span>
              </Link>
            </div>
          </li>
        </ul>

        <p className="mt-5 text-xs leading-relaxed text-acier">
          Photos d&apos;illustration :{" "}
          {photos.map((p, i) => (
            <Fragment key={p.src}>
              <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-creme">
                {p.auteur}
              </a>
              {i < photos.length - 1 ? ", " : " "}
            </Fragment>
          ))}
          (Flickr), sous licence{" "}
          <a href={LICENCE.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-creme">
            {LICENCE.nom}
          </a>
          , recadrées et étalonnées.
        </p>
      </div>
    </section>
  );
}
