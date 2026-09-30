"use client";

import { useMemo } from "react";
import { directionsUrl, fullAddress, mapsUrl, site, telHref } from "@/config/site";
import { useParisNow } from "@/hooks/useParisNow";
import { statutOuverture } from "@/lib/slots";
import { horairesSemaine } from "@/lib/horaires";
import { formatHeure, formatJourRelatif } from "@/lib/time";
import { Bouton } from "@/components/ui/Bouton";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { IconRoute, IconTel } from "@/components/ui/Icons";
import { CarteSete } from "@/components/illustrations/CarteSete";
import { cn } from "@/lib/cn";

/** Accès — adresse, statut d'ouverture en direct, horaires, carte dessinée. */
export function Acces({ n = "08", as = "h2", clair = true }: { n?: string; as?: "h2" | "h1"; clair?: boolean }) {
  const now = useParisNow();
  const statut = useMemo(() => (now ? statutOuverture(now) : null), [now]);
  const semaine = horairesSemaine();

  return (
    <section aria-labelledby="acces-titre" className={`${clair ? "clair bg-charbon-2" : "bg-charbon"} py-(--spacing-section) text-creme`}>
      <div className="container-page grid-page gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <Etiquette n={n} className="text-acier">
            Accès
          </Etiquette>
          <Lignes as={as} id="acces-titre" className="mt-6 text-d2" lines={["Grand'Rue,", <span key="b" className="text-acier">côté canal.</span>]} />

          <address className="mt-8 not-italic">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xl underline decoration-creme/30 underline-offset-8 hover:decoration-rouge">
              {fullAddress}
            </a>
            <p className="mt-3 text-sm text-acier">{site.address.landmark}</p>
          </address>

          <p className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full border border-creme/15 px-4 text-sm" aria-live="polite">
            <span aria-hidden className={cn("size-2 rounded-full", statut?.ouvert ? "bg-[#3fb36b]" : "bg-acier")} />
            {!statut || !now
              ? "…"
              : statut.ouvert
                ? `Ouvert maintenant, jusqu'à ${formatHeure(statut.jusqua ?? 0)}`
                : statut.prochaine
                  ? `Fermé. Ouvre ${formatJourRelatif(statut.prochaine.date, now.date)} à ${formatHeure(statut.prochaine.start)}`
                  : "Fermé"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Bouton href={directionsUrl} external icon={<IconRoute size={18} />}>
              Itinéraire
            </Bouton>
            <Bouton href={telHref} variant="ligne" icon={<IconTel size={18} />}>
              {site.phone.display}
            </Bouton>
          </div>

          <table className="mt-12 w-full max-w-md text-sm">
            <caption className="eyebrow mb-3 text-left text-acier">Horaires</caption>
            <tbody>
              {semaine.map((j) => {
                const today = now?.weekday === j.jour;
                return (
                  <tr key={j.jour} className={cn("border-b border-creme/10", today && "text-creme")}>
                    <th scope="row" className={cn("py-2.5 text-left font-normal", today ? "font-semibold" : "text-acier")}>
                      {j.label}
                      {today ? <span className="ml-2 text-xs text-acier">(aujourd&apos;hui)</span> : null}
                    </th>
                    <td className={cn("tabular py-2.5 text-right", j.ferme && "text-acier")}>
                      {j.texte}
                      {j.jour === "jeudi" ? <span className="ml-2 text-xs text-acier">nocturne</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <CarteSete title={`Plan d'accès : ${site.fullName}, ${fullAddress}, entre le Mont Saint-Clair et le canal royal`} />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            {site.access.fromAround.map((a) => (
              <li key={a.place} className="border-t border-creme/15 pt-3">
                <span className="block font-display text-3xl leading-none">
                  {a.minutes}
                  <span className="text-lg"> min</span>
                </span>
                <span className="text-acier">depuis {a.place}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex gap-4">
              <dt className="eyebrow w-20 shrink-0 pt-0.5 text-acier">Parking</dt>
              <dd>{site.access.parking}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="eyebrow w-20 shrink-0 pt-0.5 text-acier">Train</dt>
              <dd>{site.access.train}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="eyebrow w-20 shrink-0 pt-0.5 text-acier">Vélo</dt>
              <dd>{site.access.bike}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
