/**
 * Fiches barbiers. Desktop : le fauteuil pivote d'un poste à l'autre
 * (pin + défilement horizontal). Mobile / mouvement réduit : fiches empilées.
 */
import Link from "next/link";
import { barbiers } from "@/data/barbiers";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { Epingle } from "@/components/ui/Epingle";
import { Grave } from "@/components/ui/Grave";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { DispoSemaine } from "./DispoSemaine";
import { cn } from "@/lib/cn";

const JOURS_COURTS: Record<string, string> = { mardi: "mar", mercredi: "mer", jeudi: "jeu", vendredi: "ven", samedi: "sam" };

export function EquipeHorizontal() {
  const annee = new Date().getFullYear();

  return (
    <Epingle
      aria-label="Les barbiers"
      className="bg-charbon text-creme"
      media="(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
      snapPanels={barbiers.length}
      trackClassName="flex flex-col lg:h-svh lg:w-max lg:flex-row motion-reduce:lg:h-auto motion-reduce:lg:w-full motion-reduce:lg:flex-col"
      railClassName="bottom-6 hidden lg:block"
    >
        {barbiers.map((b, i) => (
          <article
            key={b.id}
            id={b.id}
            aria-labelledby={`nom-${b.id}`}
            className={cn(
              "relative mx-3 my-3 grid scroll-mt-20 grid-cols-12 gap-x-(--spacing-gutter) gap-y-10 overflow-hidden rounded-[2rem] bg-charbon-2 p-7 sm:p-10 lg:mx-2 lg:mb-6 lg:mt-[calc(var(--header-h)+1rem)] lg:h-[calc(100svh-var(--header-h)-2.5rem)] lg:w-[calc(100vw-3rem)] lg:p-12 motion-reduce:lg:h-auto",
            )}
            style={{ ["--paper" as string]: "var(--color-charbon-2)" }}
          >
            <div className="col-span-12 flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="eyebrow tabular text-acier">
                  Fauteuil {i + 1} · {b.role} · depuis {b.depuis}
                </p>
                <div id={`nom-${b.id}`}>
                  <Grave as="h2" text={b.prenom} className="mt-3 text-[clamp(3.5rem,2rem+6vw,8rem)] leading-none" />
                </div>
              </div>
              <div className={cn("mt-8 w-2/3 max-w-sm self-start lg:mt-0 lg:w-[48%]", i === 1 && "-scale-x-100")}>
                <ProfilStatique id={`e-${b.id}`} {...b.portrait} title={b.alt} className="w-full text-creme" />
              </div>
            </div>

            <div className="col-span-12 flex flex-col justify-end gap-8 lg:col-span-5 lg:col-start-8">
              <div>
                <p className="font-display text-3xl leading-tight">{b.specialite}</p>
                <p className="mt-3 text-creme/80">{b.style}</p>
              </div>
              <div className="space-y-3 text-sm text-creme/80">
                {b.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <dl className="grid grid-cols-2 gap-4 border-t border-creme/15 pt-4 text-sm">
                <div>
                  <dt className="eyebrow text-acier">Signature</dt>
                  <dd className="mt-1">{b.signature}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Outil fétiche</dt>
                  <dd className="mt-1">{b.outil}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Au fauteuil</dt>
                  <dd className="tabular mt-1">{b.jours.map((j) => JOURS_COURTS[j]).join(" · ")}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Métier</dt>
                  <dd className="tabular mt-1">{annee - b.depuis} ans</dd>
                </div>
              </dl>
              <blockquote className="text-lg text-creme/85">{b.replique}</blockquote>
              <DispoSemaine barbier={b.id} prenom={b.prenom} />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Bouton href={`/reserver?barbier=${b.id}`} iconEnd={<IconFleche size={20} />}>
                  Réserver avec {b.prenom}
                </Bouton>
                {i < barbiers.length - 1 ? (
                  <Link href={`#${barbiers[i + 1].id}`} className="hidden text-sm text-acier underline underline-offset-4 hover:text-creme lg:inline">
                    Fauteuil suivant : {barbiers[i + 1].prenom}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
    </Epingle>
  );
}
