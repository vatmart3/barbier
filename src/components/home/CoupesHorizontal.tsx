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

        <ul className="mt-12 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {coupes.map((c) => {
            const vedette = c.id === VEDETTE;
            return (
              <li key={c.id}>
                <article
                  aria-labelledby={`coupe-${c.id}`}
                  className={cn(
                    "group relative flex h-full flex-col rounded-[1.5rem] border bg-charbon p-7 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_20px_40px_-24px_rgb(27_33_30/0.35)]",
                    vedette ? "border-rouge/60" : "border-charbon-3 hover:border-creme/25",
                  )}
                >
                  {vedette ? (
                    <span className="absolute -top-3 right-6 rounded-full bg-rouge px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] whitespace-nowrap text-sur-accent">
                      La plus demandée
                    </span>
                  ) : null}
                  <p className="leading-none">
                    <span className="font-display tabular block text-[3.25rem] text-rouge-fonce">{c.repere}</span>
                    <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.14em] text-acier">{c.repereLegende}</span>
                  </p>
                  <h3 id={`coupe-${c.id}`} className="mt-8 text-[1.75rem] leading-tight">
                    {c.nom}
                  </h3>
                  <p className="mt-2 text-acier">{c.accroche}</p>
                  <dl className="mt-6 flex gap-6 border-t border-charbon-3 pt-4 text-sm">
                    <div>
                      <dt className="text-acier">Prix</dt>
                      <dd className="font-display tabular mt-0.5 text-2xl">{c.prix} €</dd>
                    </div>
                    <div>
                      <dt className="text-acier">Durée</dt>
                      <dd className="font-display tabular mt-0.5 text-2xl">{c.duree} min</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-acier">{c.entretien}</p>
                  <Link
                    href={`/reserver?coupe=${c.id}`}
                    className="mt-auto inline-flex min-h-11 items-center gap-1 pt-5 font-semibold text-rouge-fonce after:absolute after:inset-0 after:rounded-[1.5rem] after:content-[''] hover:underline"
                  >
                    Réserver cette coupe <span aria-hidden>›</span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Bandeau : le configurateur */}
        <div className="nuit mt-4 flex flex-wrap items-center justify-between gap-6 rounded-[1.5rem] bg-charbon-2 px-7 py-7 text-creme sm:px-10">
          <div>
            <p className="font-display text-[1.75rem] leading-tight">Pas sûr de ce qu&apos;il vous faut ?</p>
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
