/**
 * Fiches barbiers : une grande carte arrondie par barbier, portrait gravé sur
 * fond teinté à gauche, tout le détail à droite. Empilées, sans défilement forcé.
 */
import { barbiers } from "@/data/barbiers";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { DispoSemaine } from "./DispoSemaine";
import { cn } from "@/lib/cn";

const JOURS_COURTS: Record<string, string> = { mardi: "mar", mercredi: "mer", jeudi: "jeu", vendredi: "ven", samedi: "sam" };

export function EquipeHorizontal() {

  return (
    <section aria-label="Les barbiers" className="bg-charbon pb-(--spacing-section)">
      <div className="container-page space-y-4">
        {barbiers.map((b, i) => (
          <article
            key={b.id}
            id={b.id}
            aria-labelledby={`nom-${b.id}`}
            className="grid scroll-mt-20 gap-3 rounded-[2rem] bg-charbon-2 p-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <div className="flex flex-col justify-between rounded-[1.5rem] p-7 sm:p-9" style={{ background: b.teinte, ["--paper" as string]: b.teinte }}>
              <div>
                <p className="tabular text-sm text-creme-2">
                  Fauteuil {i + 1} · {b.role} · depuis {b.depuis}
                </p>
                <h2 id={`nom-${b.id}`} className="mt-1 text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none">
                  {b.prenom}
                </h2>
                <p className="font-script mt-4 max-w-xs -rotate-1 text-[1.6rem] text-rouge-fonce">{b.replique.replace(/[«»]/g, "").trim()}</p>
              </div>
              <div className={cn("mx-auto mt-8 w-2/3 max-w-72", i === 1 && "-scale-x-100")}>
                <ProfilStatique id={`e-${b.id}`} {...b.portrait} title={b.alt} className="w-full text-creme" />
              </div>
            </div>

            <div className="flex flex-col gap-7 p-5 sm:p-8">
              <div>
                <p className="font-display text-[1.75rem] leading-tight">{b.specialite}</p>
                <p className="mt-2 text-acier">{b.style}</p>
              </div>
              <div className="space-y-3 text-creme-2">
                {b.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Signature", b.signature],
                  ["Outil fétiche", b.outil],
                  ["Au fauteuil", b.jours.map((j) => JOURS_COURTS[j]).join(" · ")],
                  ["Dans le salon", b.ambiance],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl bg-charbon p-4">
                    <dt className="text-acier">{t}</dt>
                    <dd className="mt-1 font-medium">{d}</dd>
                  </div>
                ))}
              </dl>
              <DispoSemaine barbier={b.id} prenom={b.prenom} />
              <div>
                <Bouton href={`/reserver?barbier=${b.id}`} iconEnd={<IconFleche size={20} />}>
                  Réserver avec {b.prenom}
                </Bouton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
