"use client";

/** Disponibilités des 7 prochains jours pour un barbier (planning + heure réelle). */
import Link from "next/link";
import { useMemo } from "react";
import type { BarbierId } from "@/data/barbiers";
import { useParisNow } from "@/hooks/useParisNow";
import { getCreneaux, horairesBarbier } from "@/lib/slots";
import { addDays, formatDateCourte } from "@/lib/time";
import { cn } from "@/lib/cn";

export function DispoSemaine({ barbier, prenom, tone = "light" }: { barbier: BarbierId; prenom: string; tone?: "dark" | "light" }) {
  const now = useParisNow(60_000);
  const jours = useMemo(() => {
    if (!now) return null;
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(now.date, i);
      const h = horairesBarbier(barbier, date);
      const creneaux = h ? getCreneaux(barbier, date, 30, now) : [];
      const libres = creneaux.filter((c) => c.libre).length;
      return { date, travaille: !!h, libres, total: Math.max(1, creneaux.length) };
    });
  }, [now, barbier]);

  const muted = tone === "dark" ? "text-acier" : "text-acier-fonce";

  return (
    <div>
      <p className={cn("eyebrow", muted)}>Dispos des 7 prochains jours</p>
      <ol className="mt-3 grid grid-cols-7 gap-1.5">
        {(jours ?? Array.from({ length: 7 }, () => null)).map((j, i) => {
          if (!j) {
            return <li key={i} className={cn("h-28 animate-pulse rounded-2xl", tone === "dark" ? "bg-creme/5" : "bg-charbon")} />;
          }
          const d = formatDateCourte(j.date);
          const ratio = j.libres / j.total;
          const contenu = (
            <>
              <span className={cn("block text-[0.6875rem]", muted)}>{d.jour.replace(".", "")}</span>
              <span className="block font-display text-2xl leading-none">{d.num}</span>
              <span aria-hidden className={cn("mx-auto mt-2 block h-10 w-1.5 overflow-hidden rounded-full", tone === "dark" ? "bg-creme/10" : "bg-charbon-3")}>
                <span className="block w-full rounded-full bg-rouge transition-[height] duration-700" style={{ height: `${Math.round(ratio * 100)}%`, marginTop: `${Math.round((1 - ratio) * 40)}px` }} />
              </span>
              <span className={cn("mt-1 block text-[0.6875rem] tabular", j.travaille ? "" : muted)}>{j.travaille ? j.libres : "·"}</span>
            </>
          );
          return (
            <li key={j.date} className={cn("overflow-hidden rounded-2xl text-center", tone === "dark" ? "bg-creme/5" : "bg-charbon")}>
              {j.travaille && j.libres > 0 ? (
                <Link
                  href={`/reserver?barbier=${barbier}&date=${j.date}`}
                  className={cn("block min-h-11 py-2 transition-colors", tone === "dark" ? "hover:bg-creme/10" : "hover:bg-charbon-3")}
                >
                  <span className="sr-only">{`${prenom}, ${d.jour} ${d.num} ${d.mois} : ${j.libres} créneau${j.libres > 1 ? "x" : ""} libre${j.libres > 1 ? "s" : ""}. Réserver.`}</span>
                  <span aria-hidden>{contenu}</span>
                </Link>
              ) : (
                <span className="block py-2">
                  <span className="sr-only">{`${d.jour} ${d.num} : ${j.travaille ? "complet" : "ne travaille pas"}`}</span>
                  <span aria-hidden>{contenu}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className={cn("mt-2 text-xs", muted)}>Chiffre = créneaux de 30 min encore libres. Touchez un jour pour réserver.</p>
    </div>
  );
}
