import Link from "next/link";
import { barbiers } from "@/data/barbiers";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { Bouton } from "@/components/ui/Bouton";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { cn } from "@/lib/cn";

/** Les barbiers — trois cartes arrondies, portrait gravé sur fond teinté, réplique écrite à la main. */
export function Barbiers() {
  const annee = new Date().getFullYear();
  return (
    <section aria-labelledby="barbiers-titre" className="bg-charbon py-(--spacing-section)">
      <div className="container-page">
        <Etiquette>Les barbiers</Etiquette>
        <Lignes
          id="barbiers-titre"
          className="mt-4 text-d2"
          lines={["Trois paires de mains.", <span key="b" className="text-acier">Trois manies.</span>]}
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {barbiers.map((b, i) => (
            <li key={b.id} data-reveal="monte" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <article aria-labelledby={`barbier-${b.id}`} className="flex h-full flex-col rounded-[1.75rem] bg-charbon-2 p-3">
                <div className="rounded-[1.25rem] px-8 pt-8" style={{ background: b.teinte, ["--paper" as string]: b.teinte }}>
                  <div className={cn("mx-auto w-[70%] max-w-60", i === 1 && "-scale-x-100")}>
                    <ProfilStatique id={`b-${b.id}`} {...b.portrait} title={b.alt} className="w-full text-creme" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <p className="text-sm text-acier">
                    {b.role} · <span className="tabular">{annee - b.depuis} ans de métier</span>
                  </p>
                  <h3 id={`barbier-${b.id}`} className="mt-1 text-[2rem] leading-tight">
                    {b.prenom}
                  </h3>
                  <p className="mt-2 font-semibold">{b.specialite}</p>
                  <p className="mt-1 text-acier">{b.style}</p>
                  <blockquote className="font-script mt-5 text-[1.45rem] text-rouge-fonce">{b.replique.replace(/[«»]/g, "").trim()}</blockquote>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                    <Bouton href={`/reserver?barbier=${b.id}`}>Réserver avec {b.prenom}</Bouton>
                    <Link href={`/equipe#${b.id}`} className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-rouge-fonce hover:underline">
                      Ses dispos <span aria-hidden className="ml-1">›</span>
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
