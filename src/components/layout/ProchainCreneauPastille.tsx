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
        "group relative inline-flex min-h-8 shrink-0 items-center after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-[''] gap-2 rounded-full bg-creme/[0.07] px-3 text-xs text-creme transition-colors duration-200 hover:bg-creme/[0.12] sm:px-3.5",
        className,
      )}
    >
      <span className="sr-only">
        {slot && barbier ? `Prochain créneau libre : ${jour} à ${formatHeure(slot.start)} avec ${barbier.prenom}. Réserver ce créneau.` : "Voir les créneaux libres"}
      </span>
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#30d158] opacity-60" />
        <span className="relative size-2 rounded-full bg-[#30d158]" />
      </span>
      {slot && barbier ? (
        compact ? (
          <span aria-hidden className="tabular whitespace-nowrap">
            <span className="text-creme-2">{jour === "aujourd'hui" ? "Auj." : jour === "demain" ? "Demain" : jour} </span>
            <strong className="font-semibold">{formatHeure(slot.start)}</strong>
            <span className="text-creme-2 max-[399px]:hidden"> · {barbier.prenom}</span>
          </span>
        ) : (
          <span aria-hidden className="tabular whitespace-nowrap">
            <span className="text-creme-2">Prochain créneau : </span>
            {jour} <strong className="font-semibold">{formatHeure(slot.start)}</strong>
            <span className="text-creme-2"> avec </span>
            {barbier.prenom}
          </span>
        )
      ) : (
        <span className="h-3 w-44 max-w-full animate-pulse rounded-xs bg-creme/10" aria-hidden />
      )}
    </Link>
  );
}
