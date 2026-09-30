import * as z from "zod/mini";
import { NextResponse } from "next/server";
import { reservationSchema } from "@/lib/schemas";
import { estLibre } from "@/lib/slots";
import { devis, type Prestation } from "@/lib/pricing";
import { formatDateLongue, formatHeure, parisNow } from "@/lib/time";
import { getBarbier } from "@/data/barbiers";
import { fullAddress, site } from "@/config/site";
import { destinataireSalon, envoyerMail, escapeHtml } from "@/lib/email";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête illisible." }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, erreur: "Formulaire incomplet.", champs: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  const r = parsed.data;
  const d = devis(r.prestation as Prestation);
  const barbier = getBarbier(r.barbier);
  if (!d || !barbier) return NextResponse.json({ ok: false, erreur: "Prestation inconnue." }, { status: 422 });

  // Le créneau est-il toujours libre ? (même moteur que le navigateur)
  if (!estLibre(barbier.id, r.date, r.heure, d.duree, parisNow())) {
    return NextResponse.json({ ok: false, erreur: "Ce créneau vient d'être pris. Choisissez-en un autre.", code: "CRENEAU_PRIS" }, { status: 409 });
  }

  const reference = `DG-${r.date.slice(5).replace("-", "")}-${String(r.heure).padStart(4, "0")}-${barbier.id.slice(0, 2).toUpperCase()}`;
  const quand = `${formatDateLongue(r.date)} à ${formatHeure(r.heure)}`;
  const ligne = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#5c6167">${k}</td><td style="padding:4px 0"><b>${escapeHtml(v)}</b></td></tr>`;
  const tableau = `<table>${[
    ligne("Prestation", `${d.libelle} (${d.detail})`),
    ligne("Barbier", barbier.prenom),
    ligne("Quand", quand),
    ligne("Durée", `${d.duree} min`),
    ligne("Prix", `${d.prix} €`),
    ligne("Client", `${r.prenom} ${r.nom}`.trim()),
    ligne("Téléphone", r.telephone),
    ligne("E-mail", r.email || "—"),
    ligne("Note", r.note || "—"),
    ligne("Référence", reference),
  ].join("")}</table>`;

  try {
    const res = await envoyerMail({
      to: destinataireSalon(),
      subject: `Nouveau RDV — ${r.prenom}, ${quand} avec ${barbier.prenom}`,
      html: `<h2>Nouvelle réservation</h2>${tableau}`,
      replyTo: r.email || undefined,
    });
    if (r.email) {
      await envoyerMail({
        to: r.email,
        subject: `C'est noté : ${quand} chez ${site.name}`,
        html: `<p>Bonjour ${escapeHtml(r.prenom)},</p><p>Votre rendez-vous est enregistré.</p>${tableau}<p>${escapeHtml(site.fullName)}<br>${escapeHtml(fullAddress)}<br>${site.phone.display}</p><p>Annulation gratuite jusqu'à ${site.freeCancellationHours} h avant, par téléphone.</p>`,
      });
    }
    return NextResponse.json({ ok: true, reference, demo: res.demo });
  } catch (e) {
    console.error("[reservation] échec d'envoi", e);
    return NextResponse.json({ ok: false, erreur: `L'envoi a échoué. Appelez-nous au ${site.phone.display}.` }, { status: 502 });
  }
}
