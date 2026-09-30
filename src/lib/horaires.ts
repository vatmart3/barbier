import { site, type DayKey } from "@/config/site";
import { formatHeure, toMinutes } from "./time";

export const ORDRE: DayKey[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function texteHoraires(jour: DayKey): string {
  const h = site.hours[jour];
  if (!h.length) return "Fermé";
  return h.map((s) => `${formatHeure(toMinutes(s.open))} – ${formatHeure(toMinutes(s.close))}`).join(" · ");
}

/** Lignes jour par jour, lundi → dimanche */
export function horairesSemaine() {
  return ORDRE.map((jour) => ({ jour, label: cap(jour), texte: texteHoraires(jour), ferme: !site.hours[jour].length }));
}

/** Lignes groupées : « Mardi – mercredi · 9 h – 19 h » */
export function horairesGroupes() {
  const lignes = horairesSemaine();
  const out: { jours: string; texte: string; ferme: boolean }[] = [];
  let i = 0;
  while (i < lignes.length) {
    let j = i;
    while (j + 1 < lignes.length && lignes[j + 1].texte === lignes[i].texte) j++;
    out.push({
      jours: i === j ? lignes[i].label : `${lignes[i].label} – ${lignes[j].jour}`,
      texte: lignes[i].texte,
      ferme: lignes[i].ferme,
    });
    i = j + 1;
  }
  return out;
}

/** Format schema.org : [{ dayOfWeek: "Tuesday", opens: "09:00", closes: "19:00" }] */
const EN: Record<DayKey, string> = {
  lundi: "Monday",
  mardi: "Tuesday",
  mercredi: "Wednesday",
  jeudi: "Thursday",
  vendredi: "Friday",
  samedi: "Saturday",
  dimanche: "Sunday",
};

export function openingHoursSpecification() {
  return ORDRE.flatMap((jour) =>
    site.hours[jour].map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${EN[jour]}`,
      opens: s.open,
      closes: s.close,
    })),
  );
}
