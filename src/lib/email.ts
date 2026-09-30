/**
 * Envoi d'e-mails via Resend si RESEND_API_KEY est définie.
 * Sinon : mode démo — le message est journalisé et l'API renvoie un succès.
 */
import { site } from "@/config/site";

interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function envoyerMail(mail: Mail): Promise<{ demo: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[démo] e-mail non envoyé (RESEND_API_KEY absente) :", { to: mail.to, subject: mail.subject });
    return { demo: true };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? `${site.fullName} <onboarding@resend.dev>`,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    replyTo: mail.replyTo,
  });
  if (error) throw new Error(error.message);
  return { demo: false };
}

export const destinataireSalon = () => process.env.SALON_EMAIL ?? site.email;

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
