import Link from "next/link";
import { coupes } from "@/data/prestations";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { Compteur } from "@/components/ui/Compteur";
import { IconFleche } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/** Fiches coupes : chiffre de sabot, profil, gestes, prix, durée, entretien. */
export function CoupesListe() {
  return (
    <ol className="border-t border-creme/10">
      {coupes.map((c, i) => {
        const inverse = i % 2 === 1;
        return (
          <li key={c.id} id={c.id} className="scroll-mt-24 border-b border-creme/10">
            <article aria-labelledby={`t-${c.id}`} className="container-page grid-page gap-y-8 py-16 md:py-24">
              <div
                className={cn("relative col-span-12 md:col-span-5", inverse && "md:order-2 md:col-start-8")}
                style={{ ["--paper" as string]: "var(--color-charbon)" }}
              >
                <p aria-hidden className="absolute -top-4 left-0 font-display text-[clamp(7rem,4rem+10vw,14rem)] leading-none text-creme-3">
                  {c.repere}
                </p>
                <ProfilStatique
                  id={`l-${c.id}`}
                  {...c.profil}
                  dessus={c.dessusPossibles.includes("court") ? "court" : c.dessusPossibles[0]}
                  barbe="aucune"
                  title={`${c.nom} — illustration de la coupe réalisée chez Dégradé, barbier à Sète`}
                  className="relative ml-auto w-[78%] text-creme"
                />
              </div>
              <div className={cn("col-span-12 md:col-span-6", inverse ? "md:col-start-1" : "md:col-start-7")}>
                <p className="eyebrow tabular text-acier">
                  {String(i + 1).padStart(2, "0")} — {c.repere} · {c.repereLegende}
                </p>
                <h2 id={`t-${c.id}`} className="mt-4 text-d1">
                  {c.nom}
                </h2>
                <p className="mt-4 text-lg text-creme/85">{c.description}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {c.gestes.map((g) => (
                    <li key={g} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-rouge" />
                      {g}
                    </li>
                  ))}
                </ul>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-creme/15 py-5">
                  <div>
                    <dt className="eyebrow text-acier">Prix</dt>
                    <dd className="font-display text-4xl leading-none">
                      <Compteur value={c.prix} /> €
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-acier">Durée</dt>
                    <dd className="font-display text-4xl leading-none">
                      <Compteur value={c.duree} delay={100} /> min
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-acier">Retour</dt>
                    <dd className="font-display text-4xl leading-none">
                      <Compteur value={c.entretienSemaines} delay={200} /> sem.
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-acier">{c.entretien}</p>
                <div className="mt-6 flex flex-wrap gap-x-8">
                  <Link href={`/reserver?coupe=${c.id}`} className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold">
                    <span className="text-rouge-fonce group-hover:underline">Réserver</span>
                    <IconFleche size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href={`/coupes?coupe=${c.id}#configurateur`} scroll={false} className="inline-flex min-h-11 items-center text-sm text-acier underline underline-offset-4 hover:text-creme">
                    Configurer avec barbe
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
