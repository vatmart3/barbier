import {
  getBarbe,
  getCoupe,
  getDessus,
  getServiceSimple,
  type BarbeId,
  type CoupeId,
  type DessusId,
} from "@/data/prestations";

/** Ce que le client réserve : une coupe configurée, ou une prestation simple. */
export type Prestation =
  | { type: "coupe"; coupe: CoupeId; dessus: DessusId; barbe: BarbeId }
  | { type: "service"; service: string };

export interface Devis {
  libelle: string;
  detail: string;
  lignes: { label: string; prix: number }[];
  prix: number;
  duree: number;
  /** Économie réalisée par rapport aux prestations séparées */
  economie: number;
}

export function devis(p: Prestation): Devis | null {
  if (p.type === "service") {
    const s = getServiceSimple(p.service);
    if (!s) return null;
    return { libelle: s.nom, detail: s.detail, lignes: [{ label: s.nom, prix: s.prix }], prix: s.prix, duree: s.duree, economie: 0 };
  }
  const coupe = getCoupe(p.coupe);
  const dessus = getDessus(p.dessus);
  const barbe = getBarbe(p.barbe);
  if (!coupe || !dessus || !barbe) return null;
  const dessusOk = coupe.dessusPossibles.includes(dessus.id) ? dessus : getDessus(coupe.dessusPossibles[0])!;

  const lignes = [{ label: coupe.nom, prix: coupe.prix }];
  if (dessusOk.supplement) lignes.push({ label: `Dessus ${dessusOk.nom.toLowerCase()}`, prix: dessusOk.supplement });
  if (barbe.id !== "aucune") lignes.push({ label: `${barbe.nom} (formule)`, prix: barbe.prixFormule });

  const prix = lignes.reduce((s, l) => s + l.prix, 0);
  const duree = coupe.duree + dessusOk.dureeSup + barbe.duree;
  const economie = barbe.id !== "aucune" ? barbe.prixSeul - barbe.prixFormule : 0;
  const libelle = barbe.id === "aucune" ? coupe.nom : `${coupe.nom} + ${barbe.id === "taille" ? "barbe" : "rasage"}`;
  const detail = `Dessus ${dessusOk.nom.toLowerCase()} · ${barbe.nom.toLowerCase()}`;
  return { libelle, detail, lignes, prix, duree, economie };
}

/** Sérialisation dans l'URL (/reserver?coupe=…&dessus=…&barbe=…) */
export function prestationToParams(p: Prestation): Record<string, string> {
  return p.type === "coupe" ? { coupe: p.coupe, dessus: p.dessus, barbe: p.barbe } : { service: p.service };
}

export function prestationFromParams(get: (k: string) => string | null): Prestation | null {
  const service = get("service");
  if (service && getServiceSimple(service)) return { type: "service", service };
  const coupe = getCoupe(get("coupe"));
  if (!coupe) return null;
  const dessus = getDessus(get("dessus"))?.id ?? coupe.dessusPossibles[0];
  const barbe = getBarbe(get("barbe"))?.id ?? "aucune";
  return {
    type: "coupe",
    coupe: coupe.id,
    dessus: coupe.dessusPossibles.includes(dessus) ? dessus : coupe.dessusPossibles[0],
    barbe,
  };
}

export const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;
export const minutes = (n: number) => (n >= 60 ? `${Math.floor(n / 60)} h ${String(n % 60).padStart(2, "0")}` : `${n} min`);
