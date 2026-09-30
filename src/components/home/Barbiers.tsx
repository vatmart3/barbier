import Link from "next/link";
import { barbiers } from "@/data/barbiers";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { Bouton } from "@/components/ui/Bouton";

const JOURS = ["mardi", "mercredi", "jeudi", "vendredi", "samedi"] as const;
const COURT: Record<(typeof JOURS)[number], string> = { mardi: "Mar", mercredi: "Mer", jeudi: "Jeu", vendredi: "Ven", samedi: "Sam" };

/** Les barbiers — trois fiches typographiques : monogramme, spécialité, réplique, jours au fauteuil. */
export function Barbiers() {
  const annee = new Date().getFullYear();
  return (
    <section aria-labelledby="barbiers-titre" className="bg-charbon py-(--spacing-section)">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <Etiquette>Les barbiers</Etiquette>
            <Lignes
              id="barbiers-titre"
              className="mt-4 text-d2"
              lines={["Trois paires de mains.", <span key="b" className="text-acier">Trois manies.</span>]}
            />
          </div>
          <p className="max-w-sm text-acier">Pas de turnover, pas de stagiaire sur votre nuque. Chacun sa spécialité, tous capables de tout.</p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {barbiers.map((b, i) => (
            <li key={b.id} data-reveal="monte" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <article aria-labelledby={`barbier-${b.id}`} className="flex h-full flex-col rounded-[1.75rem] border border-creme/8 bg-charbon-2 p-7">
                <div className="flex items-center gap-4">
                  <span aria-hidden className="font-display grid size-14 shrink-0 place-items-center rounded-full border border-rouge/50 text-2xl text-rouge-fonce">
                    {b.prenom[0]}
                  </span>
                  <p className="text-sm leading-snug text-acier">
                    {b.role}
                    <br />
                    <span className="tabular">{annee - b.depuis} ans de métier</span>
                  </p>
                </div>
                <h3 id={`barbier-${b.id}`} className="mt-7 text-[2.25rem] leading-none">
                  {b.prenom}
                </h3>
                <p className="mt-3 font-medium">{b.specialite}</p>
                <p className="mt-1 text-acier">{b.style}</p>
                <blockquote className="font-display mt-6 border-l-2 border-rouge/70 pl-4 text-[1.0625rem] leading-relaxed text-creme-2">
                  {b.replique.replace(/[«»]/g, "").trim()}
                </blockquote>
                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`Jours au fauteuil de ${b.prenom}`}>
                  {JOURS.map((j) => {
                    const la = b.jours.includes(j);
                    return (
                      <li
                        key={j}
                        className={la ? "rounded-full bg-creme/8 px-2.5 py-1 text-xs font-medium" : "rounded-full px-2.5 py-1 text-xs text-creme/35 line-through"}
                      >
                        <span className="sr-only">{la ? `${j} : présent` : `${j} : absent`}</span>
                        <span aria-hidden>{COURT[j]}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7">
                  <Bouton href={`/reserver?barbier=${b.id}`}>Réserver avec {b.prenom}</Bouton>
                  <Link href={`/equipe#${b.id}`} className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-rouge-fonce hover:underline">
                    Ses dispos <span aria-hidden className="ml-1">›</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
