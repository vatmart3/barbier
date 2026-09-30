"use client";

/**
 * Réciprocité : « Quand revenir ? » — on offre l'information avant de
 * demander quoi que ce soit. Date de la dernière coupe → date conseillée,
 * rappel .ics, conseils d'entretien.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { site } from "@/config/site";
import { coupes, getCoupe, type CoupeId } from "@/data/prestations";
import { useParisNow } from "@/hooks/useParisNow";
import { addDays, diffDays, formatDateLongue, parisToUtc } from "@/lib/time";
import { creerIcs, telechargerIcs } from "@/lib/ics";
import { IconCalendrier, IconFleche } from "@/components/ui/Icons";

const CONSEILS = [
  { t: "Shampoing", r: "Deux à trois fois par semaine, pas tous les jours. Le cuir chevelu graisse moins, le dégradé reste net." },
  { t: "Barbe", r: "Huile le soir, peigne le matin. Jamais de sèche-cheveux à fond dessus : ça frise et ça casse." },
  { t: "Contours maison", r: "À éviter. Une nuque ratée se voit plus qu'une nuque qui repousse. Le passage contours coûte 8 €." },
  { t: "Produit", r: "Cire mate pour un dessus texturé, pommade pour un rendu brillant. Une noisette, pas plus." },
  { t: "Après rasage", r: "Eau froide, baume sans alcool, et pas de parfum sur la peau rasée le jour même." },
];

export function Entretien() {
  const now = useParisNow(60_000);
  const [coupeId, setCoupeId] = useState<CoupeId>("fade-moyen");
  const [derniere, setDerniere] = useState<string>("");
  const date = derniere || now?.date || "";
  const c = getCoupe(coupeId)!;

  const res = useMemo(() => {
    if (!date || !now) return null;
    const prochaine = addDays(date, c.entretienSemaines * 7);
    return { prochaine, dans: diffDays(now.date, prochaine) };
  }, [date, now, c.entretienSemaines]);

  const rappel = () => {
    if (!res) return;
    const debut = parisToUtc(res.prochaine, 9 * 60 + 30);
    const ics = creerIcs({
      uid: `rappel-${res.prochaine}-${coupeId}`,
      titre: `Rappel : ${c.nom} à rafraîchir (Dégradé)`,
      description: `Votre ${c.nom.toLowerCase()} date de ${c.entretienSemaines} semaines. Réserver : ${site.url}/reserver?coupe=${coupeId}`,
      debut,
      fin: new Date(debut.getTime() + 15 * 60_000),
    });
    telechargerIcs(`rappel-degrade-${res.prochaine}.ics`, ics);
  };

  return (
    <div className="grid-page gap-y-12">
      <div className="col-span-12 lg:col-span-5">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-describedby="entretien-res">
          <div>
            <label htmlFor="ent-coupe" className="eyebrow text-acier-fonce">
              Votre coupe
            </label>
            <select
              id="ent-coupe"
              value={coupeId}
              onChange={(e) => setCoupeId(e.target.value as CoupeId)}
              className="mt-2 block min-h-12 w-full border border-charbon/30 bg-transparent px-3 font-display text-2xl focus:border-charbon focus:outline-none"
            >
              {coupes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ent-date" className="eyebrow text-acier-fonce">
              Dernier passage au fauteuil
            </label>
            <input
              id="ent-date"
              type="date"
              value={date}
              max={now?.date}
              onChange={(e) => setDerniere(e.target.value)}
              className="tabular mt-2 block min-h-12 w-full border border-charbon/30 bg-transparent px-3 text-lg focus:border-charbon focus:outline-none"
            />
          </div>
        </form>

        <div id="entretien-res" className="mt-10 border-t-2 border-charbon pt-6" aria-live="polite">
          {res ? (
            <>
              <p className="eyebrow text-acier-fonce">Revenir vers le</p>
              <p className="mt-2 font-display text-d1 first-letter:uppercase">{formatDateLongue(res.prochaine)}</p>
              <p className="mt-2 text-sm text-acier-fonce">
                {res.dans > 0
                  ? `Dans ${res.dans} jour${res.dans > 1 ? "s" : ""}. ${c.entretien}`
                  : res.dans === 0
                    ? "C'est aujourd'hui. On a peut-être un créneau."
                    : `Ça fait ${-res.dans} jour${-res.dans > 1 ? "s" : ""} de trop. On ne juge pas, on rattrape.`}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                <button type="button" onClick={rappel} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
                  <IconCalendrier size={18} />
                  <span className="text-rouge-fonce group-hover:underline">Ajouter un rappel</span>
                </button>
                <Link href={`/reserver?coupe=${coupeId}`} className="group inline-flex min-h-11 items-center gap-2 text-sm text-acier-fonce hover:text-charbon">
                  Réserver maintenant
                  <IconFleche size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          ) : (
            <p className="h-24 animate-pulse bg-charbon/5" />
          )}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 lg:col-start-7">
        <h3 className="eyebrow text-acier-fonce">Entre deux passages</h3>
        <ol className="mt-4 border-t border-charbon/15">
          {CONSEILS.map((x, i) => (
            <li key={x.t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-charbon/15 py-5">
              <span className="font-display text-3xl leading-none text-acier-fonce">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-2xl leading-none">{x.t}</p>
                <p className="mt-2 text-sm text-charbon/80">{x.r}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
