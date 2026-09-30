"use client";

/** Étape 3 : coordonnées + récapitulatif, validation zod, envoi à /api/reservation. */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, type RefObject } from "react";
import { coordonneesSchema, type Coordonnees } from "@/lib/schemas";
import { euros, type Devis, type Prestation } from "@/lib/pricing";
import { formatDateLongue, formatHeure } from "@/lib/time";
import { getBarbier, type BarbierId } from "@/data/barbiers";
import { fullAddress, site } from "@/config/site";
import { IconFleche } from "@/components/ui/Icons";
import { Champ, inputCls } from "./Champ";
import { cn } from "@/lib/cn";

/** Secondes écoulées depuis la première interaction (chrono « réservé en 41 s ») */
function ecoule(t0: number | null): number | null {
  return t0 === null ? null : Math.max(1, Math.round((performance.now() - t0) / 1000));
}

export interface Confirmation {
  reference: string;
  prenom: string;
  devis: Devis;
  date: string;
  heure: number;
  barbier: BarbierId;
  secondes: number | null;
  demo: boolean;
  email: string;
}

interface Props {
  prestation: Prestation;
  devis: Devis;
  date: string;
  heure: number;
  barbier: BarbierId;
  debut: RefObject<number | null>;
  onRetour: () => void;
  onCreneauPris: () => void;
  onConfirme: (c: Confirmation) => void;
}

export function Formulaire({ prestation, devis: d, date, heure, barbier, debut, onRetour, onCreneauPris, onConfirme }: Props) {
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const b = getBarbier(barbier)!;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<Coordonnees>({
    resolver: zodResolver(coordonneesSchema),
    mode: "onTouched",
    defaultValues: { prenom: "", nom: "", telephone: "", email: "", note: "", consentement: false, site: "" },
  });

  const envoyer = handleSubmit(async (v) => {
    setErreurServeur(null);
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, prestation, barbier, date, heure }),
      });
      const json = (await res.json()) as { ok: boolean; reference?: string; erreur?: string; code?: string; demo?: boolean };
      if (json.code === "CRENEAU_PRIS") return onCreneauPris();
      if (!res.ok || !json.ok || !json.reference) throw new Error(json.erreur ?? "Erreur inconnue.");
      onConfirme({
        reference: json.reference,
        prenom: v.prenom,
        devis: d,
        date,
        heure,
        barbier,
        secondes: ecoule(debut.current),
        demo: !!json.demo,
        email: v.email,
      });
    } catch (e) {
      setErreurServeur(e instanceof Error ? e.message : `Impossible d'envoyer. Appelez-nous au ${site.phone.display}.`);
    }
  });

  const nbErreurs = Object.keys(errors).length;

  return (
    <form onSubmit={envoyer} noValidate className="grid gap-12 lg:grid-cols-[1fr_22rem]" aria-describedby={nbErreurs ? "resume-erreurs" : undefined}>
      <div>
        <h2 className="text-3xl leading-none">Vos coordonnées</h2>
        <p className="mt-2 text-sm text-acier">Pour vous rappeler si besoin. Rien d&apos;autre : pas de newsletter, pas de revente.</p>

        {submitCount > 0 && nbErreurs > 0 ? (
          <p id="resume-erreurs" role="alert" className="mt-6 rounded-xl bg-erreur/10 px-4 py-2 text-sm text-erreur">
            {nbErreurs === 1 ? "Un champ à corriger." : `${nbErreurs} champs à corriger.`}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Champ id="prenom" label="Prénom" erreur={errors.prenom?.message}>
            <input
              id="prenom"
              autoComplete="given-name"
              className={inputCls("dark", !!errors.prenom)}
              aria-invalid={!!errors.prenom}
              aria-describedby={errors.prenom ? "prenom-erreur" : undefined}
              {...register("prenom")}
            />
          </Champ>
          <Champ id="nom" label="Nom" optionnel erreur={errors.nom?.message}>
            <input id="nom" autoComplete="family-name" className={inputCls("dark", !!errors.nom)} aria-invalid={!!errors.nom} {...register("nom")} />
          </Champ>
          <Champ id="telephone" label="Téléphone" erreur={errors.telephone?.message} aide="On ne l'utilise que pour ce rendez-vous.">
            <input
              id="telephone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              className={cn(inputCls("dark", !!errors.telephone), "tabular")}
              aria-invalid={!!errors.telephone}
              aria-describedby={errors.telephone ? "telephone-erreur" : "telephone-aide"}
              {...register("telephone")}
            />
          </Champ>
          <Champ id="email" label="E-mail" optionnel erreur={errors.email?.message} aide="Pour recevoir la confirmation.">
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={inputCls("dark", !!errors.email)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-erreur" : "email-aide"}
              {...register("email")}
            />
          </Champ>
          <Champ id="note" label="Un détail pour le barbier ?" optionnel erreur={errors.note?.message} className="sm:col-span-2">
            <textarea
              id="note"
              rows={3}
              placeholder="Première fois, cheveux bouclés, photo à montrer…"
              className={cn(inputCls("dark", !!errors.note), "resize-y")}
              {...register("note")}
            />
          </Champ>
        </div>

        {/* Pot de miel : invisible pour les humains */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="site">Ne pas remplir</label>
          <input id="site" tabIndex={-1} autoComplete="off" {...register("site")} />
        </div>

        <div className="mt-8">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 accent-[var(--color-rouge)]"
              aria-invalid={!!errors.consentement}
              aria-describedby={errors.consentement ? "consentement-erreur" : undefined}
              {...register("consentement")}
            />
            <span className="text-creme/85">
              J&apos;accepte que mes coordonnées servent uniquement à gérer ce rendez-vous. Conservées 12 mois,{" "}
              <a href="/confidentialite" target="_blank" className="underline underline-offset-4">
                détails
              </a>
              .
            </span>
          </label>
          {errors.consentement ? (
            <p id="consentement-erreur" role="alert" className="mt-1.5 text-sm text-erreur">
              {errors.consentement.message}
            </p>
          ) : null}
        </div>

        <button type="button" onClick={onRetour} className="mt-8 inline-flex min-h-11 items-center text-sm text-acier underline underline-offset-4 hover:text-creme">
          Changer de créneau
        </button>
      </div>

      <aside className="papier self-start rounded-[1.5rem] bg-creme p-6 text-charbon shadow-card lg:sticky lg:top-24">
        <p className="eyebrow text-acier-fonce">Récapitulatif</p>
        <p className="mt-3 font-display text-5xl leading-none">{formatHeure(heure)}</p>
        <p className="mt-1 text-sm first-letter:uppercase">
          {formatDateLongue(date)} · avec {b.prenom}
        </p>
        <dl className="mt-5 space-y-2 border-t border-charbon/15 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-acier-fonce">Prestation</dt>
            <dd className="text-right font-semibold">{d.libelle}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-acier-fonce">Détail</dt>
            <dd className="text-right">{d.detail}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-acier-fonce">Durée</dt>
            <dd className="tabular">{d.duree} min</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-acier-fonce">Où</dt>
            <dd className="text-right">{fullAddress}</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-charbon/15 pt-4">
          <span className="text-sm text-acier-fonce">À régler au salon</span>
          <span className="font-display text-4xl leading-none">{euros(d.prix)}</span>
        </div>

        {erreurServeur ? (
          <p role="alert" className="mt-4 rounded-xl bg-rouge/10 px-3 py-2 text-sm text-rouge-fonce">
            {erreurServeur}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group mt-6 flex min-h-14 w-full items-center justify-between rounded-full bg-rouge px-6 text-sm font-semibold text-white transition-colors hover:bg-rouge-fonce disabled:cursor-wait disabled:opacity-80"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-3">
              <span aria-hidden className="relative block h-px w-8 overflow-hidden bg-creme/30">
                <span className="absolute inset-0 origin-left animate-[passe_0.9s_ease-in-out_infinite] bg-creme" />
              </span>
              Envoi…
            </span>
          ) : (
            <>
              Confirmer le rendez-vous
              <IconFleche size={20} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-acier-fonce">
          Annulation gratuite jusqu&apos;à {site.freeCancellationHours} h avant. Rien à payer en ligne.
        </p>
      </aside>
    </form>
  );
}
