import { z } from "zod";
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { site } from "@/config/site";
import { destinataireSalon, envoyerMail, escapeHtml } from "@/lib/email";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête illisible." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, erreur: "Formulaire incomplet.", champs: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  const m = parsed.data;
  try {
    const res = await envoyerMail({
      to: destinataireSalon(),
      subject: `Question du site — ${m.nom}`,
      html: `<p><b>${escapeHtml(m.nom)}</b> (${escapeHtml(m.contact)})</p><p>${escapeHtml(m.message).replace(/\n/g, "<br>")}</p>`,
      replyTo: m.contact.includes("@") ? m.contact : undefined,
    });
    return NextResponse.json({ ok: true, demo: res.demo });
  } catch (e) {
    console.error("[contact] échec d'envoi", e);
    return NextResponse.json({ ok: false, erreur: `L'envoi a échoué. Appelez-nous au ${site.phone.display}.` }, { status: 502 });
  }
}
