/**
 * « Les coupes » — la carte, comme au comptoir : six fiches typographiques
 * (numéro de sabot, nom, prix, durée, rythme d'entretien) et un bandeau vers
 * le configurateur. Aucune animation, rien à charger.
 */
import Link from "next/link";
import { coupes } from "@/data/prestations";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { Bouton } from "@/components/ui/Bouton";
import { cn } from "@/lib/cn";

const VEDETTE = "fade-moyen";

export function CoupesHorizontal() {
  return (
    <section id="coupes" aria-labelledby="coupes-titre" className="clair scroll-mt-12 bg-charbon-2 py-(--spacing-section) text-creme">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <Etiquette>Les coupes</Etiquette>
            <Lignes id="coupes-titre" className="mt-4 text-d2" lines={["Six coupes.", <span key="b" className="text-acier">Aucune au hasard.</span>]} />
          </div>
          <p className="max-w-sm text-acier">Du sabot 0 au peigne seul. Chaque coupe a son geste, sa durée et son rythme d&apos;entretien.</p>
        </div>

        <ul className="mt-10 grid gap-x-4 gap-y-5 sm:mt-12 sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-3">
          {coupes.map((c) => {
            const vedette = c.id === VEDETTE;
            return (
              <li key={c.id}>
                <article
                  aria-labelledby={`coupe-${c.id}`}
                  className={cn(
                    "group relative flex h-full flex-col rounded-[1.5rem] border bg-charbon p-5 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_20px_40px_-24px_rgb(27_33_30/0.35)] sm:p-7",
                    vedette ? "border-rouge/60" : "border-charbon-3 hover:border-creme/25",
                  )}
                >
                  {vedette ? (
                    <span className="absolute -top-3 right-5 rounded-full bg-rouge px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap text-sur-accent sm:right-6">
                      La plus demandée
                    </span>
                  ) : null}
                  {/* Téléphone : une ligne compacte (sabot · nom · prix) ; plus grand : fiche verticale */}
                  <div className="flex items-center gap-4 sm:block">
                    <p className="w-14 shrink-0 leading-none sm:w-auto">
                      <span className="font-display tabular block text-[2.5rem] text-rouge-fonce sm:text-[3.25rem]">{c.repere}</span>
                      <span className="mt-2 hidden text-xs font-semibold uppercase tracking-[0.14em] text-acier sm:block">{c.repereLegende}</span>
                    </p>
                    <div className="min-w-0 flex-1 sm:mt-8">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 id={`coupe-${c.id}`} className="text-[1.375rem] leading-tight sm:text-[1.75rem]">
                          {c.nom}
                        </h3>
                        <p className="font-display tabular shrink-0 text-xl sm:hidden">{c.prix} €</p>
                      </div>
                      <p className="mt-1 text-sm text-acier sm:mt-2 sm:text-base">
                        {c.accroche}
                        <span className="tabular whitespace-nowrap sm:hidden"> · {c.duree} min</span>
                      </p>
                    </div>
                  </div>
                  <dl className="mt-6 hidden gap-6 border-t border-charbon-3 pt-4 text-sm sm:flex">
                    <div>
                      <dt className="text-acier">Prix</dt>
                      <dd className="font-display tabular mt-0.5 text-2xl">{c.prix} €</dd>
                    </div>
                    <div>
                      <dt className="text-acier">Durée</dt>
                      <dd className="font-display tabular mt-0.5 text-2xl">{c.duree} min</dd>
                    </div>
                  </dl>
                  <p className="mt-4 hidden text-sm text-acier sm:block">{c.entretien}</p>
                  <Link
                    href={`/reserver?coupe=${c.id}`}
                    className="mt-auto inline-flex min-h-11 items-center gap-1 pt-3 font-semibold text-rouge-fonce after:absolute after:inset-0 after:rounded-[1.5rem] after:content-[''] hover:underline sm:pt-5"
                  >
                    Réserver cette coupe <span aria-hidden>›</span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Bandeau : le configurateur */}
        <div className="nuit mt-5 flex flex-wrap items-center justify-between gap-5 rounded-[1.5rem] bg-charbon-2 p-6 text-creme sm:mt-4 sm:px-10 sm:py-7">
          <div>
            <p className="font-display text-[1.5rem] leading-tight sm:text-[1.75rem]">Pas sûr de ce qu&apos;il vous faut ?</p>
            <p className="mt-1 text-creme-2">Hauteur du dégradé, longueur du dessus, barbe : le prix et la durée se calculent en direct.</p>
          </div>
          <Bouton href="/coupes#configurateur" variant="ligne">
            Composer ma coupe
          </Bouton>
        </div>
      </div>
    </section>
  );
}
