/**
 * Planning de démonstration.
 *
 * Le site n'a pas de base de données : les créneaux déjà pris sont
 * 1. les rendez-vous récurrents des habitués (ci-dessous),
 * 2. les pauses et absences déclarées,
 * 3. un remplissage réaliste généré de façon déterministe à partir de la date
 *    (même résultat sur le navigateur et sur le serveur).
 *
 * Pour brancher un vrai agenda (Planity, Google Agenda, base de données…),
 * remplacez la fonction `getRendezVous` de src/lib/slots.ts.
 */
import type { DayKey } from "@/config/site";
import type { BarbierId } from "./barbiers";

export const planningConfig = {
  /** Écart entre deux débuts de créneau proposés (minutes) */
  pas: 20,
  /** Délai minimum entre maintenant et un créneau réservable (minutes) */
  delaiMinimum: 30,
  /** Nombre de jours ouverts à la réservation */
  horizonJours: 21,
  /** Taux de remplissage simulé selon l'éloignement (0 = aujourd'hui) */
  remplissage: (joursDepuisAujourdhui: number, jour: DayKey) => {
    const base = joursDepuisAujourdhui === 0 ? 0.6 : joursDepuisAujourdhui <= 2 ? 0.55 : joursDepuisAujourdhui <= 7 ? 0.45 : 0.28;
    // Samedi et nocturne du jeudi partent plus vite
    const bonus = jour === "samedi" ? 0.15 : jour === "jeudi" ? 0.08 : 0;
    return Math.min(0.92, base + bonus);
  },
};

/** Pause déjeuner (non réservable) */
export const pauses: Record<BarbierId, { debut: string; duree: number }> = {
  karim: { debut: "12:40", duree: 40 },
  theo: { debut: "14:00", duree: 30 },
  lucas: { debut: "13:20", duree: 40 },
};

/** Habitués : rendez-vous qui reviennent chaque semaine */
export const rdvRecurrents: { barbier: BarbierId; jour: DayKey; debut: string; duree: number; note: string }[] = [
  { barbier: "karim", jour: "mardi", debut: "09:00", duree: 50, note: "M. Fabre — coupe + barbe" },
  { barbier: "karim", jour: "samedi", debut: "08:30", duree: 30, note: "Rasage du samedi" },
  { barbier: "karim", jour: "samedi", debut: "09:00", duree: 30, note: "Rasage du samedi" },
  { barbier: "theo", jour: "jeudi", debut: "19:00", duree: 40, note: "Coupe ciseaux" },
  { barbier: "theo", jour: "vendredi", debut: "09:00", duree: 30, note: "Taper" },
  { barbier: "lucas", jour: "mercredi", debut: "14:00", duree: 30, note: "Sortie du collège" },
  { barbier: "lucas", jour: "mercredi", debut: "14:40", duree: 30, note: "Sortie du collège" },
];

/** Absences ponctuelles (formation, congés). date "YYYY-MM-DD". */
export const absences: { barbier: BarbierId; date: string; motif: string }[] = [
  { barbier: "lucas", date: "2026-10-21", motif: "Formation" },
  { barbier: "karim", date: "2026-11-04", motif: "Salon professionnel" },
];

/** Durées les plus courantes, pour simuler le remplissage */
export const dureesTypes = [20, 30, 30, 30, 35, 40, 50, 50];
