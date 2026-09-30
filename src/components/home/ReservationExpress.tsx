"use client";

/**
 * Réservation express, directement sur l'accueil : prestation, barbier, date
 * et heure côte à côte, récapitulatif à droite. Tout est pré-rempli avec le
 * prochain créneau réel (moteur partagé avec /reserver et l'API) ; le bouton
 * ouvre le tunnel à l'étape « coordonnées », créneau déjà choisi.
 */
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { barbiers, getBarbier } from "@/data/barbiers";
import { devis, euros, minutes as dureeTexte, type Prestation } from "@/lib/pricing";
import { getCreneaux, joursReservables, statutOuverture, type ChoixBarbier } from "@/lib/slots";
import { addDays, formatDateLongue, formatHeure } from "@/lib/time";
import { useParisNow } from "@/hooks/useParisNow";
import { IconCalendrier, IconCheck, IconChevron, IconCiseaux, IconHorloge, IconPersonne } from "@/components/ui/Icons";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

const SERVICES: { id: string; nom: string; prestation: Prestation; params: string }[] = [
  { id: "fade-moyen", nom: "Fade moyen", prestation: { type: "coupe", coupe: "fade-moyen", dessus: "court", barbe: "aucune" }, params: "coupe=fade-moyen" },
  { id: "fade-haut", nom: "Skin fade haut", prestation: { type: "coupe", coupe: "fade-haut", dessus: "court", barbe: "aucune" }, params: "coupe=fade-haut" },
  {
    id: "coupe-barbe",
    nom: "Coupe + barbe",
    prestation: { type: "coupe", coupe: "fade-moyen", dessus: "court", barbe: "taille" },
    params: "coupe=fade-moyen&barbe=taille",
  },
  { id: "barbe-taille", nom: "Taille de barbe", prestation: { type: "service", service: "barbe-taille" }, params: "service=barbe-taille" },
  { id: "barbe-rasage", nom: "Rasage serviette chaude", prestation: { type: "service", service: "barbe-rasage" }, params: "service=barbe-rasage" },
];

const JOURS_SEMAINE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const moisFormat = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const MAX_HORAIRES = 12;

/** Grille du mois (lundi en premier) : dates "YYYY-MM-DD" ou null pour les cases vides */
function grilleMois(mois: string): (string | null)[] {
  const [y, m] = mois.split("-").map(Number);
  const decalage = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const nb = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return [
    ...Array.from({ length: decalage }, () => null),
    ...Array.from({ length: nb }, (_, i) => `${mois}-${String(i + 1).padStart(2, "0")}`),
  ];
}

const moisDecale = (mois: string, n: number) => {
  const [y, m] = mois.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

function Colonne({ icone, titre, children, className }: { icone: ReactNode; titre: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn("min-w-0 p-5 sm:p-6", className)}>
      <legend className="float-left mb-5 flex w-full items-center gap-3 text-[1.0625rem] font-medium">
        <span className="text-rouge-fonce">{icone}</span>
        {titre}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function ReservationExpress() {
  const now = useParisNow();
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [choix, setChoix] = useState<ChoixBarbier>("premier");
  const [dateChoisie, setDateChoisie] = useState<string | null>(null);
  const [heureChoisie, setHeureChoisie] = useState<number | null>(null);
  const [moisChoisi, setMoisChoisi] = useState<string | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId)!;
  const d = devis(service.prestation)!;

  const jours = useMemo(() => (now ? joursReservables(now, choix, d.duree) : []), [now, choix, d.duree]);
  const reservables = useMemo(() => new Set(jours.filter((j) => j.ouvert && j.libres > 0).map((j) => j.date)), [jours]);

  // Valeurs effectives : le choix de l'utilisateur s'il reste valable, sinon le premier disponible
  const date = dateChoisie && reservables.has(dateChoisie) ? dateChoisie : (jours.find((j) => reservables.has(j.date))?.date ?? null);
  const horaires = useMemo(
    () => (now && date ? getCreneaux(choix, date, d.duree, now).filter((c) => c.libre) : []),
    [now, date, choix, d.duree],
  );
  const creneau = horaires.find((c) => c.start === heureChoisie) ?? horaires[0] ?? null;
  const barbier = creneau?.barbier ? getBarbier(creneau.barbier) : null;

  const moisMin = now?.date.slice(0, 7) ?? null;
  const moisMax = now ? addDays(now.date, jours.length - 1).slice(0, 7) : null;
  const mois = moisChoisi ?? date?.slice(0, 7) ?? moisMin;
  const statut = now ? statutOuverture(now) : null;

  const lien =
    creneau && date
      ? `/reserver?${service.params}&barbier=${choix === "premier" ? creneau.barbier : choix}&date=${date}&heure=${creneau.start}&etape=3`
      : `/reserver?${service.params}`;

  const etapes = [
    { t: "Prestation", s: "Choisissez la prestation", ok: true },
    { t: "Barbier", s: "Choisissez votre barbier", ok: true },
    { t: "Date et heure", s: "Jour et horaire", ok: !!creneau },
    { t: "Confirmer", s: "Vérifiez et validez", ok: false },
  ];

  return (
    <section id="reserver-express" aria-labelledby="express-titre" className="relative z-10 scroll-mt-20 pb-16">
      <div className="container-page">
        <div className="rounded-[1.75rem] border border-creme/8 bg-charbon-2 p-5 sm:p-8 lg:p-10">
          {/* En-tête */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 id="express-titre" className="font-sans text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] font-light leading-tight tracking-normal">
                Réservez votre créneau
              </h2>
              <span aria-hidden className="mt-4 block h-0.5 w-12 rounded-full bg-rouge" />
            </div>
            <div className="flex items-center gap-3">
              <IconHorloge size={30} className="shrink-0 text-rouge-fonce" />
              <p className="text-sm leading-snug">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-acier">Au salon</span>
                <span className="block font-medium">Du mardi au samedi · nocturne le jeudi</span>
                <span className="mt-0.5 flex min-h-5 items-center gap-2 text-xs text-creme-2">
                  {statut ? (
                    <>
                      <span aria-hidden className={cn("size-1.5 rounded-full", statut.ouvert ? "bg-[#30d158]" : "bg-acier")} />
                      {statut.ouvert ? `Ouvert maintenant, jusqu'à ${formatHeure(statut.jusqua ?? 0)}` : "Fermé pour l'instant"}
                    </>
                  ) : null}
                </span>
              </p>
            </div>
          </div>

          {/* Étapes */}
          <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4" aria-label="Étapes">
            {etapes.map((e, i) => {
              const courante = !e.ok && etapes.slice(0, i).every((x) => x.ok);
              return (
                <li key={e.t} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                      e.ok ? "border-rouge bg-rouge text-sur-accent" : courante ? "border-rouge text-rouge-fonce" : "border-creme/25 text-creme-2",
                    )}
                  >
                    {e.ok ? <IconCheck size={16} /> : i + 1}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className={cn("block text-[0.9375rem]", e.ok || courante ? "text-creme" : "text-creme-2")}>{e.t}</span>
                    <span className="block text-xs text-acier">{e.s}</span>
                  </span>
                  {i < etapes.length - 1 ? <span aria-hidden className="ml-2 hidden h-px flex-1 bg-creme/12 md:block" /> : null}
                </li>
              );
            })}
          </ol>

          {/* Les quatre colonnes */}
          <div className="mt-8 grid rounded-[1.25rem] bg-charbon/60 lg:grid-cols-[1fr_1fr_1.2fr_1fr] lg:divide-x lg:divide-creme/8">
            <Colonne icone={<IconCiseaux size={22} />} titre="La prestation">
              <div className="space-y-2.5">
                {SERVICES.map((s) => {
                  const ds = devis(s.prestation)!;
                  const actif = s.id === serviceId;
                  return (
                    <label
                      key={s.id}
                      className={cn(
                        "flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-rouge",
                        actif ? "border-rouge bg-rouge/8" : "border-creme/10 hover:border-creme/25",
                      )}
                    >
                      <input type="radio" name="express-prestation" value={s.id} checked={actif} onChange={() => setServiceId(s.id)} className="sr-only" />
                      <span className="leading-snug">
                        <span className="block text-[0.9375rem]">{s.nom}</span>
                        <span className="tabular block text-sm text-acier">
                          {euros(ds.prix)} · {dureeTexte(ds.duree)}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn("grid size-5 shrink-0 place-items-center rounded-full border", actif ? "border-rouge bg-rouge text-sur-accent" : "border-creme/30")}
                      >
                        {actif ? <IconCheck size={12} strokeWidth={2.5} /> : null}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-5 text-sm text-acier">
                Une autre coupe ?{" "}
                <Link href="/reserver" className="text-rouge-fonce underline underline-offset-4">
                  Toute la carte
                </Link>
              </p>
            </Colonne>

            <Colonne icone={<IconPersonne size={22} />} titre="Le barbier">
              <div className="space-y-2.5">
                {[{ id: "premier" as const, prenom: "Le premier libre", detail: "Le plus rapide" }, ...barbiers.map((b) => ({ id: b.id, prenom: b.prenom, detail: b.specialite }))].map((b) => {
                  const actif = choix === b.id;
                  const fiche = b.id === "premier" ? null : getBarbier(b.id);
                  return (
                    <label
                      key={b.id}
                      className={cn(
                        "flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-rouge",
                        actif ? "border-rouge bg-rouge/8" : "border-creme/10 hover:border-creme/25",
                      )}
                    >
                      <input
                        type="radio"
                        name="express-barbier"
                        value={b.id}
                        checked={actif}
                        onChange={() => {
                          setChoix(b.id);
                          setHeureChoisie(null);
                        }}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className="font-display grid size-11 shrink-0 place-items-center rounded-full border border-rouge/35 text-lg text-rouge-fonce"
                        style={{ background: fiche?.teinte ?? "var(--color-charbon-3)" }}
                      >
                        {fiche ? fiche.prenom[0] : "?"}
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="block text-[0.9375rem]">{b.prenom}</span>
                        <span className="block truncate text-xs text-acier">{b.detail}</span>
                      </span>
                      <span
                        aria-hidden
                        className={cn("grid size-5 shrink-0 place-items-center rounded-full border", actif ? "border-rouge bg-rouge text-sur-accent" : "border-creme/30")}
                      >
                        {actif ? <IconCheck size={12} strokeWidth={2.5} /> : null}
                      </span>
                    </label>
                  );
                })}
              </div>
              <Link href="/equipe" className="mt-5 flex min-h-11 items-center justify-between text-sm text-creme-2 hover:text-creme">
                Voir l&apos;équipe <IconChevron size={16} />
              </Link>
            </Colonne>

            <Colonne icone={<IconCalendrier size={22} />} titre="La date">
              <div className="rounded-xl border border-creme/10 p-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => mois && setMoisChoisi(moisDecale(mois, -1))}
                    disabled={!mois || !moisMin || mois <= moisMin}
                    className="grid size-10 place-items-center rounded-full hover:bg-creme/5 disabled:opacity-30"
                    aria-label="Mois précédent"
                  >
                    <IconChevron dir="gauche" size={18} />
                  </button>
                  <p className="text-[0.9375rem] font-medium first-letter:uppercase" aria-live="polite">
                    {mois ? moisFormat.format(new Date(`${mois}-01T00:00:00Z`)) : "…"}
                  </p>
                  <button
                    type="button"
                    onClick={() => mois && setMoisChoisi(moisDecale(mois, 1))}
                    disabled={!mois || !moisMax || mois >= moisMax}
                    className="grid size-10 place-items-center rounded-full hover:bg-creme/5 disabled:opacity-30"
                    aria-label="Mois suivant"
                  >
                    <IconChevron size={18} />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-7 text-center text-[0.6875rem] uppercase tracking-wide text-acier" aria-hidden>
                  {JOURS_SEMAINE.map((j) => (
                    <span key={j} className="py-1.5">
                      {j}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {mois
                    ? grilleMois(mois).map((jour, i) => {
                        if (!jour) return <span key={`v${i}`} />;
                        const ok = reservables.has(jour);
                        const actif = jour === date;
                        return (
                          <button
                            key={jour}
                            type="button"
                            disabled={!ok}
                            onClick={() => {
                              setDateChoisie(jour);
                              setHeureChoisie(null);
                            }}
                            aria-pressed={actif}
                            aria-label={`${formatDateLongue(jour)}${ok ? "" : " : indisponible"}`}
                            className={cn(
                              "tabular mx-auto grid size-9 place-items-center rounded-full text-sm transition-colors",
                              actif ? "bg-rouge font-semibold text-sur-accent" : ok ? "hover:bg-creme/8" : "text-creme/25",
                            )}
                          >
                            {Number(jour.slice(8))}
                          </button>
                        );
                      })
                    : Array.from({ length: 35 }, (_, i) => <span key={i} className="mx-auto size-9 animate-pulse rounded-full bg-creme/5" />)}
                </div>
              </div>

              <p className="mb-3 mt-6 text-[0.9375rem] font-medium">L&apos;horaire</p>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Horaires libres">
                {now
                  ? horaires.slice(0, MAX_HORAIRES).map((c) => {
                      const actif = c.start === creneau?.start;
                      return (
                        <button
                          key={c.start}
                          type="button"
                          onClick={() => setHeureChoisie(c.start)}
                          aria-pressed={actif}
                          className={cn(
                            "tabular min-h-11 rounded-xl border text-sm transition-colors",
                            actif ? "border-rouge bg-rouge font-semibold text-sur-accent" : "border-creme/12 hover:border-creme/35",
                          )}
                        >
                          {formatHeure(c.start)}
                        </button>
                      );
                    })
                  : Array.from({ length: 9 }, (_, i) => <span key={i} className="h-11 animate-pulse rounded-xl bg-creme/5" />)}
              </div>
              {horaires.length > MAX_HORAIRES ? (
                <p className="mt-3 text-xs text-acier">
                  + {horaires.length - MAX_HORAIRES} autres horaires ce jour-là, dans le{" "}
                  <Link href={`/reserver?${service.params}${date ? `&date=${date}` : ""}`} className="text-rouge-fonce underline underline-offset-4">
                    tunnel complet
                  </Link>
                  .
                </p>
              ) : null}
            </Colonne>

            <div className="p-5 sm:p-6">
              <p className="mb-5 flex items-center gap-3 text-[1.0625rem] font-medium">
                <span className="text-rouge-fonce">
                  <IconCalendrier size={22} />
                </span>
                Récapitulatif
              </p>
              <dl className="grid grid-cols-2 text-sm" aria-live="polite">
                <div className="col-span-2 border-b border-creme/8 pb-3">
                  <dt className="text-acier">Prestation</dt>
                  <dd className="mt-1 flex justify-between gap-3 text-[0.9375rem]">
                    <span>{service.nom}</span>
                    <span className="tabular">{euros(d.prix)}</span>
                  </dd>
                </div>
                <div className="col-span-2 border-b border-creme/8 py-3">
                  <dt className="text-acier">Barbier</dt>
                  <dd className="mt-1 text-[0.9375rem]">
                    {barbier ? barbier.prenom : "…"}
                    {choix === "premier" && barbier ? <span className="text-acier"> (premier libre)</span> : null}
                  </dd>
                </div>
                <div className="col-span-2 border-b border-creme/8 py-3">
                  <dt className="text-acier">Date</dt>
                  <dd className="mt-1 text-[0.9375rem] first-letter:uppercase">{date ? formatDateLongue(date) : "…"}</dd>
                </div>
                <div className="border-b border-creme/8 py-3">
                  <dt className="text-acier">Horaire</dt>
                  <dd className="tabular mt-1 text-[0.9375rem]">{creneau ? formatHeure(creneau.start) : "…"}</dd>
                </div>
                <div className="border-b border-creme/8 py-3">
                  <dt className="text-acier">Durée</dt>
                  <dd className="tabular mt-1 text-[0.9375rem]">{dureeTexte(d.duree)}</dd>
                </div>
                <div className="col-span-2 flex items-baseline justify-between pt-4">
                  <dt className="text-[0.9375rem]">Total</dt>
                  <dd className="font-display tabular text-3xl text-rouge-fonce">{euros(d.prix)}</dd>
                </div>
              </dl>
              <Link
                href={lien}
                className="mt-6 flex min-h-13 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-rouge px-4 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-sur-accent transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                Confirmer le créneau
              </Link>
              <p className="mt-4 text-xs leading-relaxed text-acier">
                Il ne reste que votre prénom et votre téléphone. Paiement au salon, annulation gratuite jusqu&apos;à {site.freeCancellationHours} h avant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
