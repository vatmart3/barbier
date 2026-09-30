/**
 * Schémas zod partagés : formulaires (react-hook-form) ET routes API.
 * Une seule source de vérité pour la validation.
 * `zod/mini` : même moteur que zod 4, API fonctionnelle, bundle client réduit.
 */
import * as z from "zod/mini";
import { coupes, optionsBarbe, optionsDessus, servicesSimples } from "@/data/prestations";
import { barbiers } from "@/data/barbiers";

const tel = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const email = z.email("Cette adresse e-mail ne semble pas valide.");
const ids = <T extends { id: string }>(l: readonly T[]) => l.map((x) => x.id) as [string, ...string[]];

export const prestationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("coupe"),
    coupe: z.enum(ids(coupes)),
    dessus: z.enum(ids(optionsDessus)),
    barbe: z.enum(ids(optionsBarbe)),
  }),
  z.object({
    type: z.literal("service"),
    service: z.enum(ids(servicesSimples)),
  }),
]);

export const coordonneesSchema = z.object({
  prenom: z.string().check(z.trim(), z.minLength(2, "Votre prénom, deux lettres minimum."), z.maxLength(40, "40 caractères maximum.")),
  nom: z.string().check(z.trim(), z.maxLength(60, "60 caractères maximum.")),
  telephone: z.string().check(z.trim(), z.regex(tel, "Un numéro français, par exemple 06 12 34 56 78.")),
  email: z.union([z.literal(""), email]),
  note: z.string().check(z.trim(), z.maxLength(300, "300 caractères maximum.")),
  consentement: z.boolean().check(z.refine((v) => v, "Nécessaire pour enregistrer le rendez-vous.")),
  /** Pot de miel anti-robots : doit rester vide */
  site: z.string().check(z.maxLength(0)),
});

export type Coordonnees = z.infer<typeof coordonneesSchema>;

export const reservationSchema = z.extend(coordonneesSchema, {
  prestation: prestationSchema,
  barbier: z.enum(ids(barbiers)),
  date: z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/)),
  heure: z.int().check(z.gte(0), z.lte(24 * 60)),
});

export type ReservationPayload = z.infer<typeof reservationSchema>;

export const contactSchema = z.object({
  nom: z.string().check(z.trim(), z.minLength(2, "Votre nom, deux lettres minimum."), z.maxLength(60)),
  contact: z
    .string()
    .check(
      z.trim(),
      z.refine((v) => tel.test(v) || email.safeParse(v).success, "Un téléphone ou un e-mail, pour qu'on puisse vous répondre."),
    ),
  message: z.string().check(z.trim(), z.minLength(10, "Dix caractères minimum : dites-nous en un peu plus."), z.maxLength(1000, "1 000 caractères maximum.")),
  consentement: z.boolean().check(z.refine((v) => v, "Nécessaire pour vous répondre.")),
  site: z.string().check(z.maxLength(0)),
});

export type ContactPayload = z.infer<typeof contactSchema>;
