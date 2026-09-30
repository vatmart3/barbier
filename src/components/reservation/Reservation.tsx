"use client";

/**
 * Réservation en 3 étapes (objectif : moins de 60 secondes).
 * 1. Prestation + barbier  2. Date + créneau  3. Coordonnées + récapitulatif
 * Pré-remplissage par l'URL : ?coupe=…&dessus=…&barbe=… | ?service=…
 *                             &barbier=…&date=YYYY-MM-DD&heure=<minutes>
 */
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { barbiers, getBarbier, type BarbierId } from "@/data/barbiers";
import { coupes, optionsBarbe, optionsDessus, servicesSimples, type BarbeId, type CoupeId, type DessusId } from "@/data/prestations";
import { useParisNow } from "@/hooks/useParisNow";
import { devis, euros, prestationFromParams, type Prestation } from "@/lib/pricing";
import { estLibre, getCreneaux, joursReservables, premierLibre, type ChoixBarbier } from "@/lib/slots";
import { formatDateCourte, formatDateLongue, formatHeure, formatJourRelatif, diffDays } from "@/lib/time";
import { planningConfig } from "@/data/planning";
import { ease, transition } from "@/design/motion";
import { cn } from "@/lib/cn";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { IconFleche } from "@/components/ui/Icons";
import { Formulaire, type Confirmation } from "./Formulaire";
import { Succes } from "./Succes";

type Etape = 1 | 2 | 3;
const ETAPES = ["Prestation", "Créneau", "Coordonnées"] as const;

export function Reservation() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const now = useParisNow();

  const init = useMemo(() => {
    const barbier = params.get("barbier");
    const heure = Number(params.get("heure"));
    return {
      prestation: prestationFromParams((k) => params.get(k)),
      barbier: (getBarbier(barbier)?.id ?? "premier") as ChoixBarbier,
      date: /^\d{4}-\d{2}-\d{2}$/.test(params.get("date") ?? "") ? params.get("date") : null,
      heure: Number.isFinite(heure) && params.get("heure") ? heure : null,
      // Venu de la réservation express de l'accueil : tout est choisi, on ouvre les coordonnées
      coordonnees: params.get("etape") === "3",
    };
  }, [params]);

  const [prestation, setPrestation] = useState<Prestation | null>(init.prestation);
  const [choix, setChoix] = useState<ChoixBarbier>(init.barbier);
  const [date, setDate] = useState<string | null>(init.date);
  const [heure, setHeure] = useState<number | null>(init.heure);
  const [etape, setEtape] = useState<Etape>(1);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const debut = useRef<number | null>(null);
  const haut = useRef<HTMLDivElement>(null);

  const d = prestation ? devis(prestation) : null;
  const duree = d?.duree ?? 30;

  // Chrono démarré à la première interaction (pour « réservé en 41 s »)
  const top = () => {
    if (debut.current === null) debut.current = performance.now();
  };

  // Barbier effectivement attribué au créneau choisi
  const barbierAttribue: BarbierId | null = useMemo(() => {
    if (!now || !date || heure === null) return null;
    if (choix !== "premier") return estLibre(choix, date, heure, duree, now) ? choix : null;
    return premierLibre(date, heure, duree, now);
  }, [now, date, heure, choix, duree]);

  const creneauValide = barbierAttribue !== null;

  const aller = (e: Etape) => {
    setEtape(e);
    requestAnimationFrame(() => haut.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };

  // Créneau venu d'une autre page devenu invalide (durée différente, déjà passé…)
  const [alerte, setAlerte] = useState<string | null>(null);
  useEffect(() => {
    if (!now || !date || heure === null) return;
    if (!creneauValide) {
      const id = requestAnimationFrame(() => {
        setAlerte(`Le créneau de ${formatHeure(heure)} n'est plus libre pour ${duree} min. Choisissez-en un autre.`);
        setHeure(null);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [now, date, heure, creneauValide, duree]);

  // Arrivée depuis l'accueil avec un créneau encore libre : directement à l'étape 3
  const sautFait = useRef(false);
  useEffect(() => {
    if (sautFait.current || !init.coordonnees || !now || !prestation || !creneauValide) return;
    const id = requestAnimationFrame(() => {
      sautFait.current = true;
      setEtape(3);
    });
    return () => cancelAnimationFrame(id);
  }, [init.coordonnees, now, prestation, creneauValide]);

  if (confirmation) {
    return <Succes confirmation={confirmation} />;
  }

  const suivant1 = () => {
    top();
    // Créneau déjà choisi (depuis la pastille « prochain créneau ») : on saute l'étape 2
    aller(date && heure !== null && creneauValide ? 3 : 2);
  };

  return (
    <div ref={haut} className="scroll-mt-24">
      {/* Progression 3 étapes */}
      <nav aria-label="Étapes de la réservation" className="mb-10">
        <ol className="grid grid-cols-3 gap-2">
          {ETAPES.map((label, i) => {
            const n = (i + 1) as Etape;
            const faite = n < etape;
            const accessible = n === 1 || (n === 2 && !!prestation) || (n === 3 && !!prestation && creneauValide);
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!accessible}
                  onClick={() => aller(n)}
                  aria-current={etape === n ? "step" : undefined}
                  className="group block w-full text-left disabled:cursor-not-allowed"
                >
                  <span className="block h-1 overflow-hidden bg-creme/15">
                    <span
                      className="block h-full origin-left bg-rouge transition-transform duration-500 ease-(--ease-blade)"
                      style={{ transform: `scaleX(${faite ? 1 : etape === n ? 0.5 : 0})` }}
                    />
                  </span>
                  <span className={cn("mt-3 flex min-h-8 items-baseline gap-2 text-sm", etape === n ? "text-creme" : "text-acier group-enabled:group-hover:text-creme")}>
                    <span className="tabular text-xs">{n}</span>
                    <span className="font-semibold">{label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={etape}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={transition(reduce, { duration: 0.4, ease: ease.outCut })}
        >
          {etape === 1 ? (
            <EtapePrestation
              prestation={prestation}
              onPrestation={(p) => {
                top();
                setPrestation(p);
              }}
              choix={choix}
              onChoix={(c) => {
                top();
                setChoix(c);
              }}
              onSuivant={suivant1}
            />
          ) : etape === 2 ? (
            <EtapeCreneau
              choix={choix}
              duree={duree}
              date={date}
              heure={heure}
              alerte={alerte}
              onDate={(x) => {
                top();
                setDate(x);
                setHeure(null);
                setAlerte(null);
              }}
              onHeure={(h) => {
                top();
                setHeure(h);
                setAlerte(null);
              }}
              onChoix={setChoix}
              onSuivant={() => aller(3)}
              onRetour={() => aller(1)}
            />
          ) : prestation && d && date && heure !== null && barbierAttribue ? (
            <Formulaire
              prestation={prestation}
              devis={d}
              date={date}
              heure={heure}
              barbier={barbierAttribue}
              debut={debut}
              onRetour={() => aller(2)}
              onCreneauPris={() => {
                setHeure(null);
                setAlerte("Ce créneau vient d'être pris par quelqu'un d'autre. Choisissez-en un autre.");
                aller(2);
              }}
              onConfirme={setConfirmation}
            />
          ) : (
            <p className="text-acier">Choisissez d&apos;abord une prestation et un créneau.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Étape 1 : prestation + barbier                                      */
/* ------------------------------------------------------------------ */

function Carte({
  checked,
  onSelect,
  name,
  value,
  children,
  className,
}: {
  checked: boolean;
  onSelect: () => void;
  name: string;
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 transition-colors duration-300",
        checked ? "border-rouge bg-rouge/10 text-creme" : "border-creme/20 hover:border-creme/60",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rouge",
        className,
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onSelect} className="sr-only" />
      {children}
    </label>
  );
}

function EtapePrestation({
  prestation,
  onPrestation,
  choix,
  onChoix,
  onSuivant,
}: {
  prestation: Prestation | null;
  onPrestation: (p: Prestation) => void;
  choix: ChoixBarbier;
  onChoix: (c: ChoixBarbier) => void;
  onSuivant: () => void;
}) {
  const coupe = prestation?.type === "coupe" ? prestation : null;
  const d = prestation ? devis(prestation) : null;
  const choisirCoupe = (id: CoupeId) => {
    const c = coupes.find((x) => x.id === id)!;
    const dessus: DessusId = coupe && c.dessusPossibles.includes(coupe.dessus) ? coupe.dessus : c.dessusPossibles.includes("court") ? "court" : c.dessusPossibles[0];
    onPrestation({ type: "coupe", coupe: id, dessus, barbe: coupe?.barbe ?? "aucune" });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-10">
        <fieldset>
          <legend className="font-display text-3xl leading-none">La coupe</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {coupes.map((c) => (
              <Carte key={c.id} name="coupe" value={c.id} checked={coupe?.coupe === c.id} onSelect={() => choisirCoupe(c.id)}>
                <span className="w-10 font-display text-2xl leading-none">{c.repere}</span>
                <span className="flex-1">
                  <span className="block font-semibold">{c.nom}</span>
                  <span className="block text-xs opacity-70">{c.duree} min</span>
                </span>
                <span className="tabular text-sm">{euros(c.prix)}</span>
              </Carte>
            ))}
          </div>
        </fieldset>

        {coupe ? (
          <div className="grid gap-8 sm:grid-cols-2">
            <fieldset>
              <legend className="eyebrow text-acier">Dessus</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {optionsDessus.map((o) => {
                  const ok = coupes.find((c) => c.id === coupe.coupe)!.dessusPossibles.includes(o.id);
                  return (
                    <label
                      key={o.id}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center justify-center border text-sm transition-colors",
                        coupe.dessus === o.id ? "border-rouge bg-rouge/10 text-creme" : "border-creme/20 hover:border-creme/60",
                        !ok && "pointer-events-none opacity-30",
                        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rouge",
                      )}
                    >
                      <input
                        type="radio"
                        name="dessus"
                        className="sr-only"
                        disabled={!ok}
                        checked={coupe.dessus === o.id}
                        onChange={() => onPrestation({ ...coupe, dessus: o.id })}
                      />
                      {o.nom}
                      {o.supplement ? ` +${o.supplement} €` : ""}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow text-acier">Barbe (tarif formule)</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {optionsBarbe.map((o) => (
                  <label
                    key={o.id}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center justify-center border px-1 text-center text-sm transition-colors",
                      coupe.barbe === o.id ? "border-rouge bg-rouge/10 text-creme" : "border-creme/20 hover:border-creme/60",
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rouge",
                    )}
                  >
                    <input type="radio" name="barbe" className="sr-only" checked={coupe.barbe === o.id} onChange={() => onPrestation({ ...coupe, barbe: o.id as BarbeId })} />
                    {o.id === "aucune" ? "Non" : o.id === "taille" ? `Taille +${o.prixFormule} €` : `Rasage +${o.prixFormule} €`}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        <fieldset>
          <legend className="font-display text-3xl leading-none">Sans coupe</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {servicesSimples.map((s) => (
              <Carte
                key={s.id}
                name="coupe"
                value={s.id}
                checked={prestation?.type === "service" && prestation.service === s.id}
                onSelect={() => onPrestation({ type: "service", service: s.id })}
              >
                <span className="flex-1">
                  <span className="block font-semibold">{s.nom}</span>
                  <span className="block text-xs opacity-70">{s.duree} min</span>
                </span>
                <span className="tabular text-sm">{euros(s.prix)}</span>
              </Carte>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-3xl leading-none">Le barbier</legend>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Carte name="barbier" value="premier" checked={choix === "premier"} onSelect={() => onChoix("premier")} className="flex-col items-start justify-between">
              <span className="font-display text-4xl leading-none">?</span>
              <span>
                <span className="block font-semibold">Le premier dispo</span>
                <span className="block text-xs opacity-70">Le plus rapide</span>
              </span>
            </Carte>
            {barbiers.map((b) => (
              <Carte key={b.id} name="barbier" value={b.id} checked={choix === b.id} onSelect={() => onChoix(b.id)} className="flex-col items-start justify-between">
                <span className="block w-14" style={{ ["--paper" as string]: choix === b.id ? "var(--color-creme)" : "var(--color-charbon)" }}>
                  <ProfilStatique id={`r-${b.id}`} {...b.portrait} cape={false} className="w-full" />
                </span>
                <span>
                  <span className="block font-semibold">{b.prenom}</span>
                  <span className="block text-xs opacity-70">{b.specialite}</span>
                </span>
              </Carte>
            ))}
          </div>
        </fieldset>
      </div>

      <Recap devis={d} onSuivant={onSuivant} disabled={!prestation} label="Choisir le créneau" />
    </div>
  );
}

function Recap({
  devis: d,
  onSuivant,
  disabled,
  label,
  children,
}: {
  devis: ReturnType<typeof devis>;
  onSuivant: () => void;
  disabled: boolean;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <aside className="self-start rounded-[1.5rem] bg-charbon-2 p-6 lg:sticky lg:top-24" aria-live="polite">
      <p className="eyebrow text-acier">Récapitulatif</p>
      {d ? (
        <>
          <p className="mt-3 font-display text-3xl leading-none">{d.libelle}</p>
          <p className="mt-1 text-sm text-acier">{d.detail}</p>
          <div className="mt-4 flex items-baseline justify-between border-t border-creme/15 pt-4">
            <span className="font-display text-5xl leading-none">{euros(d.prix)}</span>
            <span className="tabular text-sm text-acier">{d.duree} min</span>
          </div>
          {d.economie > 0 ? <p className="mt-2 inline-block rounded-full bg-rouge px-3 py-0.5 text-xs font-semibold text-sur-accent">−{euros(d.economie)} en formule</p> : null}
        </>
      ) : (
        <p className="mt-3 text-sm text-acier">Choisissez une coupe ou une prestation.</p>
      )}
      {children}
      <button
        type="button"
        onClick={onSuivant}
        disabled={disabled}
        className="group mt-6 flex min-h-14 w-full items-center justify-between rounded-xl bg-rouge px-6 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-sur-accent transition-colors hover:bg-rouge-fonce disabled:cursor-not-allowed disabled:bg-creme/10 disabled:text-acier"
      >
        {label}
        <IconFleche size={20} className="transition-transform group-enabled:group-hover:translate-x-1" />
      </button>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Étape 2 : date + créneau                                            */
/* ------------------------------------------------------------------ */

function EtapeCreneau({
  choix,
  duree,
  date,
  heure,
  alerte,
  onDate,
  onHeure,
  onChoix,
  onSuivant,
  onRetour,
}: {
  choix: ChoixBarbier;
  duree: number;
  date: string | null;
  heure: number | null;
  alerte: string | null;
  onDate: (d: string) => void;
  onHeure: (h: number) => void;
  onChoix: (c: ChoixBarbier) => void;
  onSuivant: () => void;
  onRetour: () => void;
}) {
  const now = useParisNow();
  const jours = useMemo(() => (now ? joursReservables(now, choix, duree) : []), [now, choix, duree]);
  const dateEffective = date ?? jours.find((j) => j.libres > 0)?.date ?? null;
  const creneaux = useMemo(() => (now && dateEffective ? getCreneaux(choix, dateEffective, duree, now) : []), [now, dateEffective, choix, duree]);
  const libres = creneaux.filter((c) => c.libre).length;
  const selection = creneaux.find((c) => c.start === heure && c.libre);

  if (!now) return <div className="h-96 animate-pulse bg-creme/5" />;

  const matin = creneaux.filter((c) => c.start < 12 * 60);
  const aprem = creneaux.filter((c) => c.start >= 12 * 60 && c.start < 18 * 60);
  const soir = creneaux.filter((c) => c.start >= 18 * 60);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-3xl leading-none">Quel jour ?</h2>
          <label className="flex items-center gap-2 text-sm text-acier">
            Barbier
            <select
              value={choix}
              onChange={(e) => onChoix(e.target.value as ChoixBarbier)}
              className="min-h-11 border border-creme/20 bg-charbon px-2 text-creme focus:border-creme focus:outline-none"
            >
              <option value="premier">Le premier dispo</option>
              {barbiers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.prenom}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="no-scrollbar -mx-(--spacing-gutter) mt-5 overflow-x-auto px-(--spacing-gutter)" data-lenis-prevent>
          <ul className="flex gap-2 pb-2" role="listbox" aria-label="Jours disponibles">
            {jours.map((j) => {
              const d = formatDateCourte(j.date);
              const actif = j.date === dateEffective;
              const dispo = j.ouvert && j.libres > 0;
              return (
                <li key={j.date} role="option" aria-selected={actif}>
                  <button
                    type="button"
                    disabled={!dispo}
                    onClick={() => onDate(j.date)}
                    className={cn(
                      "flex h-24 w-[4.5rem] flex-col items-center justify-center gap-1 border transition-colors",
                      actif ? "border-rouge bg-rouge/10 text-creme" : "border-creme/15 hover:border-creme/60",
                      !dispo && "cursor-not-allowed border-dashed opacity-35 hover:border-creme/15",
                    )}
                    aria-label={`${formatDateLongue(j.date)} : ${!j.ouvert ? "fermé" : j.libres ? `${j.libres} créneaux libres` : "complet"}`}
                  >
                    <span className="text-[0.6875rem]">{diffDays(now.date, j.date) === 0 ? "auj." : d.jour}</span>
                    <span className="font-display text-3xl leading-none">{d.num}</span>
                    <span className="text-[0.6875rem]">{!j.ouvert ? "fermé" : j.libres ? `${j.libres} libres` : "complet"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 flex items-baseline justify-between gap-4">
          <h2 className="text-3xl leading-none first-letter:uppercase">{dateEffective ? formatJourRelatif(dateEffective, now.date) : "—"}</h2>
          <p className="text-sm text-acier">
            {libres} créneau{libres > 1 ? "x" : ""} libre{libres > 1 ? "s" : ""} · {duree} min
          </p>
        </div>

        {alerte ? (
          <p role="alert" className="mt-4 rounded-xl bg-rouge/10 px-4 py-3 text-sm">
            {alerte}
          </p>
        ) : null}

        {[
          { t: "Matin", l: matin },
          { t: "Après-midi", l: aprem },
          { t: "Soirée", l: soir },
        ]
          .filter((g) => g.l.length)
          .map((g) => (
            <fieldset key={g.t} className="mt-6">
              <legend className="eyebrow text-acier">{g.t}</legend>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-6">
                {g.l.map((c) => {
                  const actif = c.libre && c.start === heure;
                  const b = c.barbier ? getBarbier(c.barbier) : null;
                  return (
                    <button
                      key={c.start}
                      type="button"
                      disabled={!c.libre}
                      aria-pressed={actif}
                      onClick={() => {
                        if (dateEffective && date !== dateEffective) onDate(dateEffective);
                        onHeure(c.start);
                      }}
                      aria-label={c.libre ? `${formatHeure(c.start)}${choix === "premier" && b ? ` avec ${b.prenom}` : ""}` : `${formatHeure(c.start)} : déjà pris`}
                      className={cn(
                        "relative flex min-h-14 flex-col items-center justify-center border text-sm transition-[background-color,border-color,transform] duration-200 active:scale-[0.96]",
                        actif ? "border-rouge bg-rouge text-sur-accent" : c.libre ? "border-creme/20 hover:border-creme" : "cursor-not-allowed border-transparent text-acier/60",
                      )}
                    >
                      <span className={cn("tabular font-semibold", !c.libre && "line-through decoration-rouge/70 decoration-2")}>{formatHeure(c.start)}</span>
                      {choix === "premier" && c.libre && b ? <span className="text-[0.6875rem] opacity-75">{b.prenom}</span> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        {!creneaux.length ? <p className="mt-6 text-acier">Pas de créneau ce jour-là. Essayez le suivant.</p> : null}
        <p className="mt-6 text-xs text-acier">
          Créneaux rayés : déjà réservés. Réservation au plus tard {planningConfig.delaiMinimum} min avant. Au-delà, appelez : on a parfois un trou.
        </p>

        <button type="button" onClick={onRetour} className="mt-8 inline-flex min-h-11 items-center text-sm text-acier underline underline-offset-4 hover:text-creme">
          Revenir à la prestation
        </button>
      </div>

      <aside className="self-start rounded-[1.5rem] bg-charbon-2 p-6 lg:sticky lg:top-24" aria-live="polite">
        <p className="eyebrow text-acier">Votre créneau</p>
        {selection && dateEffective ? (
          <>
            <p className="mt-3 font-display text-6xl leading-none">{formatHeure(selection.start)}</p>
            <p className="mt-2 text-sm first-letter:uppercase">
              {formatDateLongue(dateEffective)}
              {selection.barbier ? ` · avec ${getBarbier(selection.barbier)?.prenom}` : ""}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-acier">Touchez une heure libre.</p>
        )}
        <button
          type="button"
          disabled={!selection}
          onClick={() => {
            if (dateEffective && date !== dateEffective) onDate(dateEffective);
            if (selection) {
              onHeure(selection.start);
              onSuivant();
            }
          }}
          className="group mt-6 flex min-h-14 w-full items-center justify-between rounded-xl bg-rouge px-6 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-sur-accent transition-colors hover:bg-rouge-fonce disabled:cursor-not-allowed disabled:bg-creme/10 disabled:text-acier"
        >
          Mes coordonnées
          <IconFleche size={20} className="transition-transform group-enabled:group-hover:translate-x-1" />
        </button>
      </aside>
    </div>
  );
}
