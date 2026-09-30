/**
 * « Les coupes » — le fauteuil pivote : section épinglée, le scroll vertical
 * devient un déplacement horizontal (composant serveur + <Epingle> client).
 * Un panneau par coupe : numéro de sabot géant, profil gravé, prix et durée en compteur mécanique, entretien.
 */
import Link from "next/link";
import { coupes } from "@/data/prestations";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { Epingle } from "@/components/ui/Epingle";
import { Compteur } from "@/components/ui/Compteur";
import { Etiquette } from "@/components/ui/Etiquette";
import { IconFleche } from "@/components/ui/Icons";

export function CoupesHorizontal() {
  return (
    <Epingle
      aria-labelledby="coupes-titre"
      className="bg-charbon text-creme"
      trackClassName="flex h-svh w-max items-stretch motion-reduce:w-full motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto"
      railClassName="bottom-8"
    >
        {/* Panneau d'ouverture */}
        <div className="flex w-[88vw] shrink-0 flex-col justify-between px-(--spacing-gutter) pb-24 pt-[calc(var(--header-h)+2.5rem)] sm:w-[60vw] lg:w-[42vw] motion-reduce:snap-start">
          <Etiquette n="02" className="text-acier">
            Les coupes
          </Etiquette>
          <div>
            <h2 id="coupes-titre" className="text-d2">
              Six coupes.
              <br />
              <span className="text-acier">Aucune au hasard.</span>
            </h2>
            <p className="mt-6 max-w-sm text-creme/80">
              Du sabot 0 au peigne seul. Chaque coupe a son geste, sa durée, son rythme d&apos;entretien. Faites pivoter le fauteuil.
            </p>
          </div>
          <p aria-hidden className="eyebrow flex items-center gap-3 text-acier">
            <span className="inline-block h-px w-12 bg-rouge" />
            Pivot <span data-deg className="tabular text-creme">0°</span>
          </p>
        </div>

        {coupes.map((c, i) => (
          <article
            key={c.id}
            data-panel
            aria-labelledby={`coupe-${c.id}`}
            className="relative flex w-[88vw] shrink-0 flex-col border-l border-creme/10 px-(--spacing-gutter) pb-24 pt-[calc(var(--header-h)+1.5rem)] sm:w-[70vw] lg:w-[56vw] xl:w-[48vw] motion-reduce:snap-start"
            style={{ ["--paper" as string]: "var(--color-charbon)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p aria-hidden className="font-display text-d3 leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_var(--color-creme)]">
                  {c.repere}
                </p>
                <p className="eyebrow mt-2 text-acier">{c.repereLegende}</p>
              </div>
              <p className="eyebrow tabular relative z-10 text-acier">
                {String(i + 1).padStart(2, "0")} / {String(coupes.length).padStart(2, "0")}
              </p>
            </div>

            <div className="pointer-events-none absolute right-[2%] top-[calc(var(--header-h)+1rem)] w-[52%] max-w-[400px] opacity-90 sm:w-[42%] lg:top-[16%]" data-profil>
              <ProfilStatique
                id={`h-${c.id}`}
                {...c.profil}
                dessus={c.dessusPossibles.includes("court") ? "court" : c.dessusPossibles[0]}
                barbe="aucune"
                className="w-full text-creme"
              />
            </div>

            <div className="relative mt-auto max-w-[26rem]">
              <h3 id={`coupe-${c.id}`} className="text-[clamp(1.9rem,1.4rem+1.6vw,3rem)] leading-[1]">
                {c.nom}
              </h3>
              <p className="mt-3 text-lg text-creme/85">{c.accroche}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-creme/15 pt-4">
                <div>
                  <dt className="eyebrow text-acier">Prix</dt>
                  <dd className="font-display text-5xl leading-none">
                    <Compteur value={c.prix} /> €
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Durée</dt>
                  <dd className="font-display text-5xl leading-none">
                    <Compteur value={c.duree} delay={120} /> min
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-acier">{c.entretien}</p>
              <Link
                href={`/reserver?coupe=${c.id}`}
                className="group mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-wide"
              >
                <span className="border-b border-rouge pb-1">Réserver un {c.nom.toLowerCase()}</span>
                <IconFleche size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}

        {/* Dernier panneau : entrée du configurateur (micro-engagement) */}
        <div className="flex w-[88vw] shrink-0 flex-col justify-center gap-8 salon border-l border-creme/10 bg-creme px-(--spacing-gutter) pb-24 pt-[calc(var(--header-h)+1.5rem)] text-charbon sm:w-[60vw] lg:w-[40vw] motion-reduce:snap-start">
          <p className="eyebrow text-acier-fonce">Étape 1 sur 3</p>
          <p className="font-display text-d1 uppercase">Pas sûr ? Composez la vôtre.</p>
          <p className="max-w-sm text-charbon/80">Hauteur du dégradé, longueur du dessus, barbe. Le prix et la durée se calculent au fur et à mesure.</p>
          <ul className="grid grid-cols-3 gap-2" aria-label="Choisir la hauteur du dégradé">
            {(["fade-bas", "fade-moyen", "fade-haut"] as const).map((id) => {
              const c = coupes.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <Link
                    href={`/coupes?coupe=${id}#configurateur`}
                    className="flex min-h-24 flex-col justify-between border border-charbon/25 p-3 transition-colors hover:border-charbon hover:bg-charbon hover:text-creme"
                  >
                    <span className="font-display text-3xl leading-none">{c.repere}</span>
                    <span className="text-xs">{c.nom.replace("Skin fade haut", "Fade haut")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
    </Epingle>
  );
}
