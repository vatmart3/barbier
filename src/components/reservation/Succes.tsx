"use client";

/** Écran de succès : ticket de rendez-vous, calendrier (.ics / Google), itinéraire. */
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { directionsUrl, fullAddress, site, telHref } from "@/config/site";
import { getBarbier } from "@/data/barbiers";
import { creerIcs, lienGoogleAgenda, telechargerIcs } from "@/lib/ics";
import { euros } from "@/lib/pricing";
import { formatDateLongue, formatHeure, parisToUtc } from "@/lib/time";
import { ease } from "@/design/motion";
import { IconCalendrier, IconRoute, IconTel, IconTelecharger } from "@/components/ui/Icons";
import type { Confirmation } from "./Formulaire";

export function Succes({ confirmation: c }: { confirmation: Confirmation }) {
  const reduce = useReducedMotion();
  const titre = useRef<HTMLHeadingElement>(null);
  const b = getBarbier(c.barbier)!;
  const debut = parisToUtc(c.date, c.heure);
  const fin = new Date(debut.getTime() + c.devis.duree * 60_000);
  const evt = {
    titre: `${c.devis.libelle} avec ${b.prenom} — ${site.name}`,
    description: `Réf. ${c.reference}. ${c.devis.detail}. ${euros(c.devis.prix)} à régler au salon. Annulation : ${site.phone.display}.`,
    debut,
    fin,
  };

  useEffect(() => {
    titre.current?.focus();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_24rem]">
      <div>
        <p className="eyebrow text-acier">Réservation confirmée</p>
        <h2 ref={titre} tabIndex={-1} className="mt-4 text-d2 focus:outline-none">
          C&apos;est noté,
          <br />
          {c.prenom}.
        </h2>
        {c.secondes !== null ? (
          <p className="mt-6 text-lg text-creme/85">
            Réservé en <strong className="tabular font-semibold text-creme">{c.secondes} s</strong>. {c.secondes <= 60 ? "Moins d'une minute, comme promis." : "Le fauteuil, lui, ne presse personne."}
          </p>
        ) : null}
        <p className="mt-3 max-w-lg text-creme/75">
          {c.email ? `Une confirmation part vers ${c.email}. ` : ""}
          {b.prenom} vous attend {formatDateLongue(c.date)} à {formatHeure(c.heure)}. Un empêchement ? Appelez au moins {site.freeCancellationHours} h avant, c&apos;est
          gratuit.
        </p>
        {c.demo ? <p className="mt-4 text-xs text-acier">Site de démonstration : aucun rendez-vous réel n&apos;a été créé.</p> : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => telechargerIcs(`rdv-degrade-${c.date}.ics`, creerIcs({ uid: c.reference, ...evt, rappelMinutes: 120 }))}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-creme px-5 text-sm font-semibold text-charbon transition-colors hover:bg-creme-2"
          >
            <IconTelecharger size={18} />
            Ajouter au calendrier (.ics)
          </button>
          <a
            href={lienGoogleAgenda(evt)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-creme/30 px-5 text-sm font-semibold transition-colors hover:border-creme"
          >
            <IconCalendrier size={18} />
            Google Agenda
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-creme/30 px-5 text-sm font-semibold transition-colors hover:border-creme"
          >
            <IconRoute size={18} />
            Itinéraire
          </a>
        </div>
        <p className="mt-10 text-sm text-acier">
          En attendant :{" "}
          <Link href="/coupes#entretien" className="underline underline-offset-4 hover:text-creme">
            quand revenir après cette coupe
          </Link>
          .
        </p>
      </div>

      {/* Le ticket */}
      <motion.div
        className="papier relative self-start rounded-[1.5rem] bg-creme text-charbon shadow-paper"
        initial={reduce ? { opacity: 0 } : { y: -40, rotate: 4, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={reduce ? { opacity: 1 } : { y: 0, rotate: -1.5, opacity: 1, clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.9, ease: ease.outCut, delay: 0.15 }}
      >
        <div className="p-6">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl leading-none">Dégradé</p>
            <p className="eyebrow tabular text-acier-fonce">{c.reference}</p>
          </div>
          <p className="mt-6 font-display text-7xl leading-none">{formatHeure(c.heure)}</p>
          <p className="mt-1 font-semibold first-letter:uppercase">{formatDateLongue(c.date)}</p>
          <dl className="mt-6 space-y-2 border-t border-dashed border-charbon/30 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-acier-fonce">Barbier</dt>
              <dd className="font-semibold">{b.prenom}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-acier-fonce">Prestation</dt>
              <dd className="text-right">{c.devis.libelle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-acier-fonce">Durée</dt>
              <dd className="tabular">{c.devis.duree} min</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-acier-fonce">Au salon</dt>
              <dd className="tabular font-semibold">{euros(c.devis.prix)}</dd>
            </div>
          </dl>
        </div>
        {/* Perforation */}
        <div aria-hidden className="relative h-4">
          <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[#0f0f0f]" />
          <span className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[#0f0f0f]" />
          <span className="absolute inset-x-4 top-1/2 border-t border-dashed border-charbon/30" />
        </div>
        <div className="flex items-center justify-between gap-4 p-6 pt-3 text-sm">
          <span>{fullAddress}</span>
          <a href={telHref} className="inline-flex min-h-11 items-center gap-2 font-semibold" aria-label={`Appeler le salon : ${site.phone.display}`}>
            <IconTel size={16} />
            <span className="tabular whitespace-nowrap">{site.phone.display}</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
