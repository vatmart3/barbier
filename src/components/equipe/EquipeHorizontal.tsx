/**
 * Fiches barbiers : une grande carte arrondie par barbier, portrait gravé sur
 * fond teinté à gauche, tout le détail à droite. Empilées, sans défilement forcé.
 */
import { barbiers } from "@/data/barbiers";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { DispoSemaine } from "./DispoSemaine";

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
            <div className="flex flex-col justify-between gap-10 rounded-[1.5rem] border border-creme/8 bg-charbon p-7 sm:p-9">
              <div>
                <p className="tabular text-sm text-acier">
                  Fauteuil {i + 1} · {b.role} · depuis {b.depuis}
                </p>
                <h2 id={`nom-${b.id}`} className="mt-2 text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none">
                  {b.prenom}
                </h2>
                <blockquote className="font-display mt-6 max-w-sm border-l-2 border-rouge/70 pl-4 text-lg leading-relaxed text-creme-2">
                  {b.replique.replace(/[«»]/g, "").trim()}
                </blockquote>
              </div>
              <dl className="grid grid-cols-2 gap-4 border-t border-creme/8 pt-6 text-sm">
                <div>
                  <dt className="text-acier">Au fauteuil depuis</dt>
                  <dd className="font-display tabular mt-1 text-3xl">{b.depuis}</dd>
                </div>
                <div>
                  <dt className="text-acier">Fauteuil</dt>
                  <dd className="font-display tabular mt-1 text-3xl">n° {i + 1}</dd>
                </div>
              </dl>
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
