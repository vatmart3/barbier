"use client";

/**
 * « Prochain créneau libre » — révélé sous le hero fendu.
 * Heure calculée en direct (planning.ts + heure de Paris), compteur mécanique,
 * rareté réelle : le nombre de créneaux restants aujourd'hui.
 */
import Link from "next/link";
import { useMemo } from "react";
import { barbiers, getBarbier } from "@/data/barbiers";
import { useParisNow } from "@/hooks/useParisNow";
import { creneauxRestantsAujourdhui, prochainCreneau, statutOuverture } from "@/lib/slots";
import { formatHeure, formatJourRelatif, pad } from "@/lib/time";
import { Compteur } from "@/components/ui/Compteur";
import { Bouton } from "@/components/ui/Bouton";
import { Etiquette } from "@/components/ui/Etiquette";
import { IconFleche } from "@/components/ui/Icons";

const lien = (s: { barbier: string; date: string; start: number }) => `/reserver?barbier=${s.barbier}&date=${s.date}&heure=${s.start}`;

export function ProchainCreneau() {
  const now = useParisNow();
  const data = useMemo(() => {
    if (!now) return null;
    return {
      premier: prochainCreneau(now, 30),
      parBarbier: barbiers.map((b) => ({ b, slot: prochainCreneau(now, 30, b.id) })),
      restants: creneauxRestantsAujourdhui(now, 30),
      statut: statutOuverture(now),
    };
  }, [now]);

  const p = data?.premier;
  const heure = p ? `${pad(Math.floor(p.start / 60))}:${pad(p.start % 60)}` : "00:00";
  const jour = p && now ? formatJourRelatif(p.date, now.date) : "…";
  const barbier = p ? getBarbier(p.barbier) : null;

  return (
    <section aria-labelledby="creneau-titre" className="relative flex h-full min-h-svh flex-col bg-creme text-charbon">
      <div className="container-page flex flex-1 flex-col justify-center pb-10 pt-[calc(var(--header-h)+2rem)]">
        <div className="grid-page gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Etiquette n="01" className="text-acier-fonce">
              Prochain créneau libre
            </Etiquette>
            <h2 id="creneau-titre" className="sr-only">
              Prochain créneau libre chez Dégradé
            </h2>
            <p className="mt-6 font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-none first-letter:uppercase" aria-live="polite">
              {jour}
              {barbier ? (
                <>
                  , avec <span className="text-rouge-fonce">{barbier.prenom}</span>
                </>
              ) : null}
            </p>
            <p className="mt-2 font-display text-d3 leading-[0.8]" aria-hidden={!p}>
              <Compteur value={heure} duration={1100} />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Bouton href={p ? lien(p) : "/reserver"} size="lg" iconEnd={<IconFleche size={22} />}>
                Prendre ce créneau
              </Bouton>
              {data ? (
                <p className="text-sm text-acier-fonce">
                  {data.statut.ouvert
                    ? data.restants > 0
                      ? `Encore ${data.restants} créneau${data.restants > 1 ? "x" : ""} aujourd'hui, ouvert jusqu'à ${formatHeure(data.statut.jusqua ?? 0)}.`
                      : "Plus rien aujourd'hui. Demain matin, en revanche…"
                    : data.statut.prochaine
                      ? `Fermé pour l'instant. Réouverture ${formatJourRelatif(data.statut.prochaine.date, now!.date)} à ${formatHeure(data.statut.prochaine.start)}.`
                      : null}
                </p>
              ) : null}
            </div>
          </div>

          <div className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
            <p className="eyebrow mb-3 text-acier-fonce">Ou choisissez votre barbier</p>
            <ul className="border-t border-charbon/15">
              {barbiers.map((b) => {
                const s = data?.parBarbier.find((x) => x.b.id === b.id)?.slot;
                return (
                  <li key={b.id} className="border-b border-charbon/15">
                    <Link
                      href={s ? lien(s) : `/reserver?barbier=${b.id}`}
                      className="group flex min-h-14 items-center justify-between gap-4 py-3 transition-colors hover:text-rouge-fonce"
                    >
                      <span className="font-display text-3xl leading-none">{b.prenom}</span>
                      <span className="tabular flex items-center gap-3 text-sm">
                        {s && now ? (
                          <>
                            <span className="text-acier-fonce">{formatJourRelatif(s.date, now.date)}</span>
                            <strong className="font-semibold">{formatHeure(s.start)}</strong>
                          </>
                        ) : (
                          <span className="h-3 w-24 animate-pulse bg-charbon/10" aria-hidden />
                        )}
                        <IconFleche size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
