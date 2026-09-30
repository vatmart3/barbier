"use client";

/**
 * Configurateur de coupe : coupe × dessus × barbe.
 * Le profil SVG se met à jour en direct (hauteur du fondu, volume du dessus,
 * barbe), prix et durée recalculés, puis « Réserver cette coupe » pré-remplit
 * la réservation. Progression en 3 étapes (micro-engagement).
 */
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState } from "react";
import { coupes, optionsBarbe, optionsDessus, getCoupe, type BarbeId, type CoupeId, type DessusId } from "@/data/prestations";
import { devis, euros, prestationToParams } from "@/lib/pricing";
import { ProfilTete } from "@/components/illustrations/ProfilTete";
import { Compteur } from "@/components/ui/Compteur";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { ease, transition } from "@/design/motion";
import { cn } from "@/lib/cn";

type Etape = 0 | 1 | 2;
const ETAPES = ["La coupe", "Le dessus", "La barbe"] as const;

function Option({
  name,
  value,
  checked,
  disabled,
  onChange,
  onPointerPick,
  titre,
  detail,
  aside,
}: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  /** Choix à la souris / au doigt : on passe à l'étape suivante */
  onPointerPick?: () => void;
  titre: string;
  detail: string;
  aside?: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex min-h-16 cursor-pointer items-center gap-4 border px-4 py-3 transition-colors duration-300",
        checked ? "border-charbon bg-charbon text-creme" : "border-charbon/20 hover:border-charbon",
        disabled && "cursor-not-allowed opacity-40 hover:border-charbon/20",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rouge",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onClick={(e) => {
          // detail > 0 : vrai clic (le clavier déclenche aussi "click", avec detail = 0)
          if (e.detail > 0) onPointerPick?.();
        }}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn("grid size-5 shrink-0 place-items-center rounded-full border", checked ? "border-creme" : "border-charbon/40")}
      >
        <span className={cn("size-2.5 rounded-full bg-rouge transition-transform duration-300 ease-(--ease-thud)", checked ? "scale-100" : "scale-0")} />
      </span>
      <span className="flex-1">
        <span className="block font-display text-2xl leading-none">{titre}</span>
        <span className={cn("mt-1 block text-xs", checked ? "text-creme/75" : "text-acier-fonce")}>{detail}</span>
      </span>
      {aside ? <span className="tabular text-sm">{aside}</span> : null}
    </label>
  );
}

export function Configurateur() {
  const params = useSearchParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const initiale = getCoupe(params.get("coupe"));

  const [coupe, setCoupe] = useState<CoupeId>(initiale?.id ?? "fade-moyen");
  const [dessus, setDessus] = useState<DessusId>("court");
  const [barbe, setBarbe] = useState<BarbeId>("aucune");
  const [etape, setEtape] = useState<Etape>(initiale ? 1 : 0);
  const [faites, setFaites] = useState<Set<Etape>>(() => new Set(initiale ? [0] : []));

  const c = getCoupe(coupe)!;
  const dessusEffectif: DessusId = c.dessusPossibles.includes(dessus) ? dessus : c.dessusPossibles[0];
  const d = devis({ type: "coupe", coupe, dessus: dessusEffectif, barbe });

  const valider = (e: Etape) => {
    setFaites((prev) => new Set(prev).add(e));
    if (e < 2) setEtape((e + 1) as Etape);
  };
  const auClic = (e: Etape) => () => {
    setFaites((prev) => new Set(prev).add(e));
    if (e < 2) window.setTimeout(() => setEtape((cur) => (cur === e ? ((e + 1) as Etape) : cur)), 380);
  };
  const progression = faites.size / 3;

  const reserver = () => {
    const q = new URLSearchParams(prestationToParams({ type: "coupe", coupe, dessus: dessusEffectif, barbe }));
    router.push(`/reserver?${q.toString()}`);
  };

  const restantes = 3 - faites.size;

  return (
    <div className="grid-page gap-y-10">
      {/* Profil en direct */}
      <div className="col-span-12 lg:col-span-6">
        <div className="sticky top-(--header-h) z-10 bg-creme-2 text-charbon shadow-[0_12px_24px_-16px_rgba(17,17,17,0.4)] lg:top-24 lg:shadow-none" style={{ ["--paper" as string]: "var(--color-creme-2)" }}>
          <div className="absolute left-4 top-4 z-10">
            <p className="eyebrow text-acier-fonce">Votre coupe</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={d?.libelle}
                className="font-display text-3xl leading-none"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={transition(reduce, { duration: 0.3, ease: ease.outCut })}
              >
                {d?.libelle}
              </motion.p>
            </AnimatePresence>
          </div>
          <p aria-hidden className="absolute right-4 top-2 font-display text-[clamp(4rem,2rem+6vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1px_var(--color-charbon)]">
            {c.repere}
          </p>
          <ProfilTete
            fade={c.profil.fade}
            skin={c.profil.skin}
            dessus={dessusEffectif}
            barbe={barbe}
            vapeur
            guides
            title={`Aperçu : ${d?.libelle}, ${d?.detail}`}
            className="mx-auto h-[34svh] w-auto pt-12 lg:h-auto lg:w-full lg:max-w-[520px] lg:pt-16"
          />
        </div>
      </div>

      {/* Étapes */}
      <div className="col-span-12 lg:col-span-5 lg:col-start-8">
        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs">
            <span className="eyebrow text-acier-fonce">
              Étape {etape + 1} sur 3 · {ETAPES[etape]}
            </span>
            <span className="text-acier-fonce" aria-live="polite">
              {restantes === 0 ? "Coupe complète." : restantes === 1 ? "Plus qu'une étape." : `${restantes} étapes`}
            </span>
          </div>
          <div
            className="mt-3 grid grid-cols-3 gap-1"
            role="progressbar"
            aria-label="Progression du configurateur"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={faites.size}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 overflow-hidden bg-charbon/10">
                <span
                  className="block h-full origin-left bg-rouge transition-transform duration-500 ease-(--ease-blade)"
                  style={{ transform: `scaleX(${faites.has(i as Etape) ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>
          <span className="sr-only">{Math.round(progression * 100)} %</span>
        </div>

        <div role="tablist" aria-label="Étapes" className="mb-6 flex gap-2">
          {ETAPES.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={etape === i}
              aria-controls={`etape-${i}`}
              id={`tab-etape-${i}`}
              onClick={() => setEtape(i as Etape)}
              className={cn(
                "min-h-11 flex-1 border-b-2 px-2 text-sm font-semibold transition-colors",
                etape === i ? "border-rouge text-charbon" : "border-transparent text-acier-fonce hover:text-charbon",
              )}
            >
              <span className="tabular mr-1.5 text-xs">{i + 1}</span>
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={etape}
            id={`etape-${etape}`}
            role="tabpanel"
            aria-labelledby={`tab-etape-${etape}`}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={transition(reduce, { duration: 0.35, ease: ease.outCut })}
          >
            <fieldset className="space-y-2">
            <legend className="sr-only">{ETAPES[etape]}</legend>
            {etape === 0
              ? coupes.map((x) => (
                  <Option
                    key={x.id}
                    name="coupe"
                    value={x.id}
                    checked={coupe === x.id}
                    onChange={() => setCoupe(x.id)}
                    onPointerPick={auClic(0)}
                    titre={x.nom}
                    detail={`${x.repere} · ${x.repereLegende}`}
                    aside={euros(x.prix)}
                  />
                ))
              : etape === 1
                ? optionsDessus.map((x) => {
                    const ok = c.dessusPossibles.includes(x.id);
                    return (
                      <Option
                        key={x.id}
                        name="dessus"
                        value={x.id}
                        checked={dessusEffectif === x.id}
                        disabled={!ok}
                        onChange={() => setDessus(x.id)}
                        onPointerPick={auClic(1)}
                        titre={x.nom}
                        detail={ok ? x.detail : `Pas avec un ${c.nom.toLowerCase()}`}
                        aside={x.supplement ? `+${euros(x.supplement)}` : "inclus"}
                      />
                    );
                  })
                : optionsBarbe.map((x) => (
                    <Option
                      key={x.id}
                      name="barbe"
                      value={x.id}
                      checked={barbe === x.id}
                      onChange={() => setBarbe(x.id)}
                      onPointerPick={auClic(2)}
                      titre={x.nom}
                      detail={x.detail}
                      aside={x.prixFormule ? `+${euros(x.prixFormule)}` : "—"}
                    />
                  ))}
            </fieldset>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-end">
          {etape < 2 ? (
            <button
              type="button"
              onClick={() => valider(etape)}
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-wide"
            >
              <span className="border-b border-rouge pb-0.5">Valider · {ETAPES[etape + 1].toLowerCase()}</span>
              <IconFleche size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button type="button" onClick={() => valider(2)} className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide">
              <span className="border-b border-rouge pb-0.5">Valider la barbe</span>
            </button>
          )}
        </div>

        {/* Récapitulatif */}
        {d ? (
          <div className="mt-8 bg-charbon p-6 text-creme">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-acier">Total</p>
                <p className="font-display text-7xl leading-none">
                  <Compteur value={d.prix} duration={600} /> €
                </p>
              </div>
              <div className="text-right">
                <p className="eyebrow text-acier">Au fauteuil</p>
                <p className="font-display text-5xl leading-none">
                  <Compteur value={d.duree} duration={600} /> min
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-1 border-t border-creme/15 pt-4 text-sm">
              {d.lignes.map((l) => (
                <li key={l.label} className="flex justify-between">
                  <span className="text-creme/80">{l.label}</span>
                  <span className="tabular">{euros(l.prix)}</span>
                </li>
              ))}
            </ul>
            <AnimatePresence>
              {d.economie > 0 ? (
                <motion.p
                  className="mt-3 inline-block bg-rouge px-2 py-1 text-xs font-semibold uppercase tracking-wider"
                  initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
                  animate={{ scale: 1, opacity: 1, rotate: -2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: ease.thud }}
                >
                  Formule : {euros(d.economie)} d&apos;économie
                </motion.p>
              ) : null}
            </AnimatePresence>
            <p className="mt-4 text-xs text-acier">Entretien conseillé : {c.entretien.toLowerCase()}</p>
            <div className="mt-6">
              <Bouton onClick={reserver} size="lg" iconEnd={<IconFleche size={22} />} pleine>
                Réserver cette coupe
              </Bouton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
