import Link from "next/link";
import { coupes } from "@/data/prestations";
import { Bouton } from "@/components/ui/Bouton";

/** Fiches coupes : numéro de sabot, description, gestes, prix, durée, entretien. */
export function CoupesListe() {
  return (
    <ol className="container-page space-y-4">
      {coupes.map((c) => {
        return (
          <li key={c.id} id={c.id} className="scroll-mt-24">
            <article aria-labelledby={`t-${c.id}`} className="grid gap-6 rounded-[2rem] border border-creme/8 bg-charbon-2 p-6 sm:p-9 md:grid-cols-[9rem_1fr] md:gap-10">
              <div className="flex items-baseline gap-4 md:block">
                <p className="font-display tabular text-[4.5rem] leading-none text-rouge-fonce md:text-[6rem]">{c.repere}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-acier md:mt-3">
                  Sabot
                  <span className="mt-1 block font-normal normal-case tracking-normal">{c.repereLegende}</span>
                </p>
              </div>

              <div className="flex flex-col">
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
