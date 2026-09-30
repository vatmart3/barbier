/**
 * Heure de Paris, indépendante du fuseau du visiteur et du serveur (Vercel = UTC).
 * On manipule des dates "YYYY-MM-DD" et des minutes depuis minuit pour éviter
 * les pièges de fuseau horaire.
 */
import type { DayKey } from "@/config/site";

export const TZ = "Europe/Paris";

const DAYS: DayKey[] = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export interface ParisNow {
  /** YYYY-MM-DD */
  date: string;
  /** minutes depuis minuit, heure de Paris */
  minutes: number;
  weekday: DayKey;
}

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function parisParts(d: Date) {
  const p = Object.fromEntries(partsFormatter.formatToParts(d).map((x) => [x.type, x.value]));
  return {
    y: Number(p.year),
    m: Number(p.month),
    d: Number(p.day),
    h: Number(p.hour),
    min: Number(p.minute),
    s: Number(p.second),
  };
}

export function parisNow(at: Date = new Date()): ParisNow {
  const p = parisParts(at);
  const date = `${p.y}-${pad(p.m)}-${pad(p.d)}`;
  return { date, minutes: p.h * 60 + p.min, weekday: weekdayOf(date) };
}

export const pad = (n: number) => String(n).padStart(2, "0");

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** 1050 → "17:30" */
export function toHHMM(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

/** 1050 → "17 h 30" ; 1020 → "17 h" (typographie française, espaces insécables : jamais coupé en fin de ligne) */
export function formatHeure(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}\u00a0h` : `${h}\u00a0h\u00a0${pad(m)}`;
}

function parseDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function weekdayOf(date: string): DayKey {
  return DAYS[parseDate(date).getUTCDay()];
}

export function addDays(date: string, n: number): string {
  const d = parseDate(date);
  d.setUTCDate(d.getUTCDate() + n);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86_400_000);
}

const longDate = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const shortDay = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "UTC" });
const dayNum = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: "UTC" });
const monthShort = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

/** "jeudi 2 octobre" */
export const formatDateLongue = (date: string) => longDate.format(parseDate(date));
/** { jour: "jeu.", num: "2", mois: "oct." } */
export const formatDateCourte = (date: string) => {
  const d = parseDate(date);
  return { jour: shortDay.format(d), num: dayNum.format(d), mois: monthShort.format(d) };
};

/** "aujourd'hui", "demain", ou "jeudi 2 octobre" */
export function formatJourRelatif(date: string, today: string): string {
  const n = diffDays(today, date);
  if (n === 0) return "aujourd'hui";
  if (n === 1) return "demain";
  if (n > 1 && n < 7) return weekdayOf(date);
  return formatDateLongue(date);
}

/** Convertit une heure locale de Paris en instant UTC (gère l'heure d'été). */
export function parisToUtc(date: string, minutes: number): Date {
  const [y, m, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
  const p = parisParts(new Date(guess));
  const asIfUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min);
  const offset = asIfUtc - guess;
  return new Date(guess - offset);
}
