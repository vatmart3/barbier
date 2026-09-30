"use client";

import { useEffect, useState } from "react";
import { parisNow, type ParisNow } from "@/lib/time";

/**
 * Heure de Paris côté navigateur, rafraîchie toutes les 30 s.
 * Renvoie null au premier rendu (pas de décalage d'hydratation : le HTML
 * statique ne contient jamais une heure figée au moment du build).
 */
export function useParisNow(intervalMs = 30_000): ParisNow | null {
  const [now, setNow] = useState<ParisNow | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow((prev) => {
        const next = parisNow();
        return prev && prev.date === next.date && prev.minutes === next.minutes ? prev : next;
      });
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
