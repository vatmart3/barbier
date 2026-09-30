/**
 * Schémas zod partagés : formulaires (react-hook-form) ET routes API.
 * Une seule source de vérité pour la validation.
 */
import { z } from "zod";
import { coupes, optionsBarbe, optionsDessus, servicesSimples } from "@/data/prestations";
import { barbiers } from "@/data/barbiers";

const tel = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const prestationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("coupe"),
    coupe: z.enum(coupes.map((c) => c.id) as [string, ...string[]]),
    dessus: z.enum(optionsDessus.map((d) => d.id) as [string, ...string[]]),
    barbe: z.enum(optionsBarbe.map((b) => b.id) as [string, ...string[]]),
  }),
  z.object({
    type: z.literal("service"),
    service: z.enum(servicesSimples.map((s) => s.id) as [string, ...string[]]),
  }),
]);

export const coordonneesSchema = z.object({
  prenom: z.string().trim().min(2, "Votre prénom, deux lettres minimum.").max(40, "40 caractères maximum."),
  nom: z.string().trim().max(60, "60 caractères maximum."),
  telephone: z.string().trim().regex(tel, "Un numéro français, par exemple 06 12 34 56 78."),
  email: z.union([z.literal(""), z.email("Cette adresse e-mail ne semble pas valide.")]),
  note: z.string().trim().max(300, "300 caractères maximum."),
  consentement: z.boolean().refine((v) => v, "Nécessaire pour enregistrer le rendez-vous."),
  /** Pot de miel anti-robots : doit rester vide */
  site: z.string().max(0),
});

export type Coordonnees = z.infer<typeof coordonneesSchema>;

export const reservationSchema = coordonneesSchema.extend({
  prestation: prestationSchema,
  barbier: z.enum(barbiers.map((b) => b.id) as [string, ...string[]]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  heure: z.number().int().min(0).max(24 * 60),
});

export type ReservationPayload = z.infer<typeof reservationSchema>;

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Votre nom, deux lettres minimum.").max(60),
  contact: z
    .string()
    .trim()
    .refine((v) => tel.test(v) || z.email().safeParse(v).success, "Un téléphone ou un e-mail, pour qu'on puisse vous répondre."),
  message: z.string().trim().min(10, "Dix caractères minimum : dites-nous en un peu plus.").max(1000, "1 000 caractères maximum."),
  consentement: z.boolean().refine((v) => v, "Nécessaire pour vous répondre."),
  site: z.string().max(0),
});

export type ContactPayload = z.infer<typeof contactSchema>;
