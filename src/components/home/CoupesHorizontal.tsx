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

export function CoupesHorizontal() {
  return (
    <Epingle
      aria-labelledby="coupes-titre"
      className="bg-charbon text-creme"
      trackClassName="flex h-svh w-max items-stretch motion-reduce:w-full motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto"
      railClassName="bottom-7 rounded-full"
    >
        {/* Panneau d'ouverture */}
        <div className="flex w-[86vw] shrink-0 flex-col justify-between px-(--spacing-gutter) pb-24 pt-[calc(var(--header-h)+2.5rem)] sm:w-[56vw] lg:w-[38vw] motion-reduce:snap-start">
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
            Faites défiler <span aria-hidden>→</span>
          </p>
        </div>

        {coupes.map((c, i) => (
          <article
            key={c.id}
            data-panel
            aria-labelledby={`coupe-${c.id}`}
            className="relative mx-2 mb-16 mt-[calc(var(--header-h)+1rem)] flex w-[86vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-charbon-2 p-7 sm:w-[64vw] sm:p-10 lg:w-[46vw] xl:w-[40vw] motion-reduce:snap-start"
            style={{ ["--paper" as string]: "var(--color-charbon-2)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p aria-hidden className="font-display text-d3 leading-none text-creme-3">
                  {c.repere}
                </p>
                <p className="eyebrow mt-2 text-acier">{c.repereLegende}</p>
              </div>
              <p className="eyebrow tabular relative z-10 text-acier">
                {String(i + 1).padStart(2, "0")} / {String(coupes.length).padStart(2, "0")}
              </p>
            </div>

            <div className="pointer-events-none absolute right-[4%] top-[8%] w-[50%] max-w-[360px] sm:w-[42%]" data-profil>
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
              <dl className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <dt className="eyebrow text-acier">Prix</dt>
                  <dd className="font-display text-4xl leading-none">
                    <Compteur value={c.prix} /> €
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Durée</dt>
                  <dd className="font-display text-4xl leading-none">
                    <Compteur value={c.duree} delay={120} /> min
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-acier">{c.entretien}</p>
              <Link
                href={`/reserver?coupe=${c.id}`}
                className="mt-5 inline-flex min-h-11 items-center gap-1 text-[1.0625rem] text-rouge-fonce hover:underline"
              >
                Réserver un {c.nom.toLowerCase()} <span aria-hidden>›</span>
              </Link>
            </div>
          </article>
        ))}

        {/* Dernier panneau : entrée du configurateur (micro-engagement) */}
        <div className="mx-2 mb-16 mr-(--spacing-gutter) mt-[calc(var(--header-h)+1rem)] flex w-[86vw] shrink-0 flex-col justify-center gap-6 rounded-[2rem] bg-creme p-8 text-charbon sm:w-[56vw] sm:p-10 lg:w-[36vw] motion-reduce:snap-start">
          <p className="eyebrow text-charbon/70">Étape 1 sur 3</p>
          <p className="font-display text-d1">Pas sûr ? Composez la vôtre.</p>
          <p className="max-w-sm text-charbon/80">Hauteur du dégradé, longueur du dessus, barbe. Le prix et la durée se calculent au fur et à mesure.</p>
          <ul className="grid grid-cols-3 gap-2" aria-label="Choisir la hauteur du dégradé">
            {(["fade-bas", "fade-moyen", "fade-haut"] as const).map((id) => {
              const c = coupes.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <Link
                    href={`/coupes?coupe=${id}#configurateur`}
                    className="flex min-h-24 flex-col justify-between rounded-2xl bg-charbon/10 p-4 transition-colors hover:bg-charbon/20"
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
