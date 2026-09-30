"use client";

/**
 * Pastille header : « Prochain créneau : aujourd'hui 17 h 40 avec Théo ».
 * Calculée à partir de src/data/planning.ts et de l'heure réelle de Paris.
 */
import Link from "next/link";
import { useMemo } from "react";
import { useParisNow } from "@/hooks/useParisNow";
import { prochainCreneau } from "@/lib/slots";
import { formatHeure, formatJourRelatif } from "@/lib/time";
import { getBarbier } from "@/data/barbiers";
import { cn } from "@/lib/cn";

export function ProchainCreneauPastille({ className, compact = false }: { className?: string; compact?: boolean }) {
  const now = useParisNow();
  const slot = useMemo(() => (now ? prochainCreneau(now, 30) : null), [now]);
  const barbier = slot ? getBarbier(slot.barbier) : null;

  const href = slot
    ? `/reserver?barbier=${slot.barbier}&date=${slot.date}&heure=${slot.start}`
    : "/reserver";

  const jour = slot && now ? formatJourRelatif(slot.date, now.date) : "";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill border border-creme/15 bg-charbon/60 px-3 text-xs text-creme sm:px-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-creme/50",
        className,
      )}
      aria-label={slot && barbier ? `Prochain créneau libre : ${jour} à ${formatHeure(slot.start)} avec ${barbier.prenom}. Réserver ce créneau.` : "Voir les créneaux libres"}
    >
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 animate-blink rounded-full bg-rouge" />
        <span className="relative size-2 rounded-full bg-rouge" />
      </span>
      {slot && barbier ? (
        compact ? (
          <span className="tabular whitespace-nowrap">
            <span className="text-acier">{jour === "aujourd'hui" ? "Auj." : jour === "demain" ? "Demain" : jour} </span>
            <strong className="font-semibold">{formatHeure(slot.start)}</strong>
            <span className="text-acier max-[359px]:hidden"> · {barbier.prenom}</span>
          </span>
        ) : (
          <span className="tabular whitespace-nowrap">
            <span className="text-acier">Prochain créneau : </span>
            {jour} <strong className="font-semibold">{formatHeure(slot.start)}</strong>
            <span className="text-acier"> avec </span>
            {barbier.prenom}
          </span>
        )
      ) : (
        <span className="h-3 w-44 max-w-full animate-pulse rounded-xs bg-creme/10" aria-hidden />
      )}
    </Link>
  );
}
