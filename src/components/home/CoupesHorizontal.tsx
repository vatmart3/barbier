/**
 * « Les coupes » — une carte arrondie par coupe, dans un carrousel natif
 * (glisser au doigt, flèches rondes au clavier / à la souris).
 * Profil gravé, prix et durée, rythme d'entretien. Dernière carte : le configurateur.
 */
import Link from "next/link";
import { coupes } from "@/data/prestations";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { Carrousel } from "@/components/ui/Carrousel";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";

export function CoupesHorizontal() {
  return (
    <section id="coupes" aria-labelledby="coupes-titre" className="scroll-mt-12 bg-charbon-2 py-(--spacing-section)">
      <div className="container-page">
        <Etiquette>Les coupes</Etiquette>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <Lignes id="coupes-titre" className="text-d2" lines={["Six coupes.", <span key="b" className="text-acier">Aucune au hasard.</span>]} />
          <p className="max-w-sm text-acier">
            Du sabot 0 au peigne seul. Chaque coupe a son geste, sa durée et son rythme d&apos;entretien.
          </p>
        </div>
        <p aria-hidden className="font-script mt-5 inline-block -rotate-2 text-2xl text-rouge-fonce">
          la plus demandée ? le fade moyen, de loin.
        </p>
      </div>

      <Carrousel label="Les six coupes" className="mt-10">
        {coupes.map((c) => (
          <li key={c.id} className="w-[84%] max-w-[23rem] shrink-0 snap-start sm:w-[22rem]">
            <article aria-labelledby={`coupe-${c.id}`} className="flex h-full flex-col rounded-[1.75rem] bg-charbon p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
              <div className="relative overflow-hidden rounded-[1.25rem] bg-charbon-2 px-6 pt-10" style={{ ["--paper" as string]: "var(--color-charbon-2)" }}>
                <p className="absolute left-4 top-4 rounded-full bg-charbon px-3 py-1 text-xs font-semibold">
                  <span className="text-acier">Sabot </span>
                  <span className="tabular">{c.repere}</span>
                </p>
                <ProfilStatique
                  id={`h-${c.id}`}
                  {...c.profil}
                  dessus={c.dessusPossibles.includes("court") ? "court" : c.dessusPossibles[0]}
                  barbe="aucune"
                  className="mx-auto w-[78%] text-creme"
                />
              </div>
              <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 id={`coupe-${c.id}`} className="text-[1.75rem] leading-tight">
                    {c.nom}
                  </h3>
                  <p className="font-display tabular shrink-0 text-2xl">{c.prix} €</p>
                </div>
                <p className="mt-1 text-acier">
                  {c.accroche} <span className="tabular whitespace-nowrap">· {c.duree} min</span>
                </p>
                <p className="mt-4 text-sm text-acier">{c.entretien}</p>
                <Link
                  href={`/reserver?coupe=${c.id}`}
                  className="mt-auto inline-flex min-h-11 items-center gap-1 pt-4 font-semibold text-rouge-fonce hover:underline"
                >
                  Réserver un {c.nom.toLowerCase()} <span aria-hidden>›</span>
                </Link>
              </div>
            </article>
          </li>
        ))}

        {/* Dernière carte : entrée du configurateur */}
        <li className="w-[84%] max-w-[23rem] shrink-0 snap-start sm:w-[22rem]">
          <div className="nuit flex h-full flex-col justify-between gap-8 rounded-[1.75rem] bg-charbon-2 p-7 text-creme">
            <div>
              <p className="text-sm font-semibold text-ambre">Pas sûr ?</p>
              <p className="font-display mt-2 text-[2rem] leading-tight">Composez la vôtre.</p>
              <p className="mt-3 text-creme-2">Hauteur du dégradé, longueur du dessus, barbe. Le prix et la durée se calculent au fur et à mesure.</p>
            </div>
            <ul className="grid grid-cols-3 gap-2" aria-label="Choisir la hauteur du dégradé">
              {(["fade-bas", "fade-moyen", "fade-haut"] as const).map((id) => {
                const c = coupes.find((x) => x.id === id)!;
                return (
                  <li key={id}>
                    <Link
                      href={`/coupes?coupe=${id}#configurateur`}
                      className="flex min-h-24 flex-col justify-between rounded-2xl bg-white/10 p-4 transition-colors hover:bg-white/18"
                    >
                      <span className="font-display tabular text-3xl leading-none">{c.repere}</span>
                      <span className="text-xs text-creme-2">{c.nom.replace("Skin fade haut", "Fade haut")}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      </Carrousel>
    </section>
  );
}
