import Link from "next/link";
import { coupes } from "@/data/prestations";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { Bouton } from "@/components/ui/Bouton";
import { cn } from "@/lib/cn";

/** Fiches coupes : une carte arrondie par coupe, profil dans sa tuile, gestes, prix, durée, entretien. */
export function CoupesListe() {
  return (
    <ol className="container-page space-y-4">
      {coupes.map((c, i) => {
        const inverse = i % 2 === 1;
        return (
          <li key={c.id} id={c.id} className="scroll-mt-24">
            <article aria-labelledby={`t-${c.id}`} className="grid gap-3 rounded-[2rem] bg-charbon-2 p-3 md:grid-cols-2">
              <div
                className={cn("relative flex items-end justify-center rounded-[1.5rem] bg-charbon px-8 pt-16", inverse && "md:order-2")}
                style={{ ["--paper" as string]: "var(--color-charbon)" }}
              >
                <p className="absolute left-5 top-5 rounded-full bg-charbon-2 px-3.5 py-1.5 text-sm font-semibold">
                  Sabot <span className="tabular">{c.repere}</span> <span className="font-normal text-acier">· {c.repereLegende}</span>
                </p>
                <ProfilStatique
                  id={`l-${c.id}`}
                  {...c.profil}
                  dessus={c.dessusPossibles.includes("court") ? "court" : c.dessusPossibles[0]}
                  barbe="aucune"
                  title={`${c.nom} : illustration de la coupe réalisée chez Dégradé, barbier à Sète`}
                  className="w-[72%] max-w-sm text-creme"
                />
              </div>

              <div className="flex flex-col p-4 sm:p-8">
                <h2 id={`t-${c.id}`} className="text-d1">
                  {c.nom}
                </h2>
                <p className="mt-3 text-lg text-creme-2">{c.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {c.gestes.map((g) => (
                    <li key={g} className="flex gap-3">
                      <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-rouge" />
                      {g}
                    </li>
                  ))}
                </ul>
                <dl className="mt-8 grid grid-cols-3 gap-2">
                  {[
                    ["Prix", `${c.prix} €`],
                    ["Durée", `${c.duree} min`],
                    ["À refaire", `${c.entretienSemaines} sem.`],
                  ].map(([t, v]) => (
                    <div key={t} className="rounded-2xl bg-charbon px-4 py-3">
                      <dt className="text-sm text-acier">{t}</dt>
                      <dd className="font-display tabular mt-0.5 text-2xl sm:text-3xl">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm text-acier">{c.entretien}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-6">
                  <Bouton href={`/reserver?coupe=${c.id}`}>Réserver</Bouton>
                  <Link
                    href={`/coupes?coupe=${c.id}#configurateur`}
                    scroll={false}
                    className="inline-flex min-h-11 items-center font-medium text-rouge-fonce hover:underline"
                  >
                    Configurer avec barbe <span aria-hidden className="ml-1">›</span>
                  </Link>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
