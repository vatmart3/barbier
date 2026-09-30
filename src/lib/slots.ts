/**
 * Moteur de créneaux : partagé par le navigateur (affichage) et le serveur
 * (validation de /api/reservation). Tout est calculé en heure de Paris.
 */
import { site, type DayKey } from "@/config/site";
import { barbiers, type BarbierId } from "@/data/barbiers";
import { absences, dureesTypes, pauses, planningConfig, rdvRecurrents } from "@/data/planning";
import { addDays, diffDays, toMinutes, weekdayOf, type ParisNow } from "./time";

export interface Plage {
  start: number;
  end: number;
}

export type ChoixBarbier = BarbierId | "premier";

export interface Creneau {
  start: number;
  libre: boolean;
  /** Barbier attribué (utile pour « le premier disponible ») */
  barbier: BarbierId | null;
}

/* ---------- Horaires --------------------------------------------------- */

export function horairesSalon(date: string): Plage | null {
  if (site.closedDates.includes(date)) return null;
  const slots = site.hours[weekdayOf(date) as DayKey];
  if (!slots.length) return null;
  return { start: toMinutes(slots[0].open), end: toMinutes(slots[slots.length - 1].close) };
}

export function horairesBarbier(id: BarbierId, date: string): Plage | null {
  const salon = horairesSalon(date);
  if (!salon) return null;
  const b = barbiers.find((x) => x.id === id);
  if (!b) return null;
  const jour = weekdayOf(date);
  if (!b.jours.includes(jour)) return null;
  if (absences.some((a) => a.barbier === id && a.date === date)) return null;
  const perso = b.horairesPerso?.[jour];
  return perso ? { start: toMinutes(perso.open), end: toMinutes(perso.close) } : salon;
}

/* ---------- Rendez-vous existants (déterministes) ---------------------- */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const overlaps = (a: Plage, b: Plage) => a.start < b.end && b.start < a.end;

const cache = new Map<string, Plage[]>();

/**
 * Rendez-vous déjà pris pour un barbier à une date.
 * À remplacer par un appel à l'agenda réel pour une mise en production.
 */
export function getRendezVous(id: BarbierId, date: string, today: string): Plage[] {
  const key = `${id}|${date}|${today}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const heures = horairesBarbier(id, date);
  if (!heures) return [];
  const jour = weekdayOf(date);
  const pris: Plage[] = [];

  const p = pauses[id];
  if (p) pris.push({ start: toMinutes(p.debut), end: toMinutes(p.debut) + p.duree });

  for (const r of rdvRecurrents) {
    if (r.barbier === id && r.jour === jour) pris.push({ start: toMinutes(r.debut), end: toMinutes(r.debut) + r.duree });
  }

  // Remplissage simulé : probabilité de démarrer un rendez-vous à chaque pas de 10 min
  const taux = planningConfig.remplissage(Math.max(0, diffDays(today, date)), jour);
  const moyenne = dureesTypes.reduce((a, b) => a + b, 0) / dureesTypes.length;
  const proba = (10 * taux) / (moyenne - (moyenne - 10) * taux);
  const rand = mulberry32(hash(`${id}:${date}`));

  let t = heures.start;
  while (t < heures.end) {
    const occupe = pris.find((x) => t >= x.start && t < x.end);
    if (occupe) {
      t = occupe.end;
      continue;
    }
    if (rand() < proba) {
      const duree = dureesTypes[Math.floor(rand() * dureesTypes.length)];
      const plage = { start: t, end: t + duree };
      if (plage.end <= heures.end && !pris.some((x) => overlaps(x, plage))) {
        pris.push(plage);
        t = plage.end;
        continue;
      }
    }
    t += 10;
  }

  pris.sort((a, b) => a.start - b.start);
  cache.set(key, pris);
  if (cache.size > 500) cache.clear();
  return pris;
}

/* ---------- Disponibilités --------------------------------------------- */

export function estLibre(id: BarbierId, date: string, start: number, duree: number, now: ParisNow): boolean {
  const heures = horairesBarbier(id, date);
  if (!heures) return false;
  const plage = { start, end: start + duree };
  if (plage.start < heures.start || plage.end > heures.end) return false;
  if (date < now.date) return false;
  if (date === now.date && start < now.minutes + planningConfig.delaiMinimum) return false;
  if (diffDays(now.date, date) > planningConfig.horizonJours) return false;
  return !getRendezVous(id, date, now.date).some((x) => overlaps(x, plage));
}

function chargeDuJour(id: BarbierId, date: string, today: string) {
  return getRendezVous(id, date, today).reduce((s, x) => s + (x.end - x.start), 0);
}

/** Barbier libre le moins chargé ce jour-là (répartition équitable) */
export function premierLibre(date: string, start: number, duree: number, now: ParisNow): BarbierId | null {
  const libres = barbiers.filter((b) => estLibre(b.id, date, start, duree, now));
  if (!libres.length) return null;
  libres.sort((a, b) => chargeDuJour(a.id, date, now.date) - chargeDuJour(b.id, date, now.date));
  return libres[0].id;
}

/**
 * Créneaux affichés pour une date. Les créneaux déjà passés (aujourd'hui)
 * ne sont pas listés ; les créneaux pris sont renvoyés avec libre=false.
 */
export function getCreneaux(choix: ChoixBarbier, date: string, duree: number, now: ParisNow): Creneau[] {
  const ids: BarbierId[] = choix === "premier" ? barbiers.map((b) => b.id) : [choix];
  const plages = ids.map((id) => horairesBarbier(id, date)).filter((x): x is Plage => !!x);
  if (!plages.length) return [];
  const debut = Math.min(...plages.map((p) => p.start));
  const fin = Math.max(...plages.map((p) => p.end));
  const limite = date === now.date ? now.minutes + planningConfig.delaiMinimum : -1;
  const out: Creneau[] = [];

  for (let t = debut; t + duree <= fin; t += planningConfig.pas) {
    if (t < limite) continue;
    if (choix === "premier") {
      const b = premierLibre(date, t, duree, now);
      out.push({ start: t, libre: !!b, barbier: b });
    } else {
      out.push({ start: t, libre: estLibre(choix, date, t, duree, now), barbier: choix });
    }
  }
  return out;
}

export interface ProchainCreneau {
  date: string;
  start: number;
  barbier: BarbierId;
}

export function prochainCreneau(now: ParisNow, duree = 30, choix: ChoixBarbier = "premier"): ProchainCreneau | null {
  for (let i = 0; i <= planningConfig.horizonJours; i++) {
    const date = addDays(now.date, i);
    const libre = getCreneaux(choix, date, duree, now).find((c) => c.libre);
    if (libre && libre.barbier) return { date, start: libre.start, barbier: libre.barbier };
  }
  return null;
}

/** Les N prochains créneaux libres, un barbier donné ou tous */
export function prochainsCreneaux(now: ParisNow, n: number, duree = 30, choix: ChoixBarbier = "premier"): ProchainCreneau[] {
  const out: ProchainCreneau[] = [];
  for (let i = 0; i <= planningConfig.horizonJours && out.length < n; i++) {
    const date = addDays(now.date, i);
    for (const c of getCreneaux(choix, date, duree, now)) {
      if (c.libre && c.barbier) out.push({ date, start: c.start, barbier: c.barbier });
      if (out.length >= n) break;
    }
  }
  return out;
}

/** Nombre réel de créneaux encore libres aujourd'hui (tous barbiers) */
export function creneauxRestantsAujourdhui(now: ParisNow, duree = 30): number {
  return getCreneaux("premier", now.date, duree, now).filter((c) => c.libre).length;
}

export interface JourReservable {
  date: string;
  ouvert: boolean;
  libres: number;
}

export function joursReservables(now: ParisNow, choix: ChoixBarbier, duree: number): JourReservable[] {
  return Array.from({ length: planningConfig.horizonJours }, (_, i) => {
    const date = addDays(now.date, i);
    const creneaux = getCreneaux(choix, date, duree, now);
    const libres = creneaux.filter((c) => c.libre).length;
    const ouvert = choix === "premier" ? !!horairesSalon(date) : !!horairesBarbier(choix, date);
    return { date, ouvert, libres };
  });
}

/** Statut d'ouverture du salon en direct */
export function statutOuverture(now: ParisNow): { ouvert: boolean; jusqua?: number; prochaine?: { date: string; start: number } } {
  const h = horairesSalon(now.date);
  if (h && now.minutes >= h.start && now.minutes < h.end) return { ouvert: true, jusqua: h.end };
  for (let i = 0; i < 14; i++) {
    const date = addDays(now.date, i);
    const hh = horairesSalon(date);
    if (hh && (i > 0 || now.minutes < hh.start)) return { ouvert: false, prochaine: { date, start: hh.start } };
  }
  return { ouvert: false };
}
