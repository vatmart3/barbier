/**
 * Fichiers calendrier .ics (RFC 5545) générés côté navigateur, sans serveur.
 */
import { fullAddress, site } from "@/config/site";

const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Replie les lignes > 75 octets (exigence RFC 5545) */
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

export interface EvenementIcs {
  uid: string;
  titre: string;
  description: string;
  debut: Date;
  fin: Date;
  /** Rappel N minutes avant */
  rappelMinutes?: number;
}

export function creerIcs(e: EvenementIcs): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Degrade Barbier//Reservation//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}@degrade-barbier`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(e.debut)}`,
    `DTEND:${fmt(e.fin)}`,
    `SUMMARY:${esc(e.titre)}`,
    `DESCRIPTION:${esc(e.description)}`,
    `LOCATION:${esc(`${site.fullName}, ${fullAddress}`)}`,
    `GEO:${site.geo.lat};${site.geo.lng}`,
    "STATUS:CONFIRMED",
  ];
  if (e.rappelMinutes) {
    lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(e.titre)}`, `TRIGGER:-PT${e.rappelMinutes}M`, "END:VALARM");
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function telechargerIcs(nomFichier: string, contenu: string) {
  const blob = new Blob([contenu], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomFichier;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function lienGoogleAgenda(e: Omit<EvenementIcs, "uid">): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: e.titre,
    dates: `${fmt(e.debut)}/${fmt(e.fin)}`,
    details: e.description,
    location: `${site.fullName}, ${fullAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
