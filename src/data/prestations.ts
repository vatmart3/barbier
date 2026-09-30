/**
 * Prestations, prix et durées. Modifier ici met à jour : pages, configurateur,
 * réservation, JSON-LD (Service + Offer) et récapitulatifs.
 * Prix TTC en euros, durées en minutes.
 */

export type CoupeId = "fade-bas" | "fade-moyen" | "fade-haut" | "taper" | "buzz" | "ciseaux";
export type DessusId = "ras" | "court" | "long";
export type BarbeId = "aucune" | "taille" | "rasage";
export type FadeLevel = "aucun" | "bas" | "moyen" | "haut" | "taper";

export interface Coupe {
  id: CoupeId;
  nom: string;
  /** Chiffre géant affiché (numéro de sabot, longueur…) */
  repere: string;
  repereLegende: string;
  accroche: string;
  description: string;
  gestes: string[];
  duree: number;
  prix: number;
  /** Fréquence d'entretien conseillée, en semaines */
  entretienSemaines: number;
  entretien: string;
  dessusPossibles: DessusId[];
  /** Paramètres du profil SVG */
  profil: { fade: FadeLevel; skin: boolean };
  seo: string;
}

export const coupes: Coupe[] = [
  {
    id: "fade-bas",
    nom: "Fade bas",
    repere: "0,5",
    repereLegende: "sabot de départ",
    accroche: "Le dégradé qui passe au bureau.",
    description:
      "Le fondu démarre juste au-dessus de l'oreille et de la nuque. Discret de face, net de profil. Le bon premier dégradé.",
    gestes: ["Sabot 0,5 → 1 → 2 en remontant", "Transition au peigne, tondeuse à main levée", "Contours et trace à la tondeuse de finition"],
    duree: 30,
    prix: 25,
    entretienSemaines: 3,
    entretien: "À refaire toutes les 3 semaines. Contours seuls possibles à 2 semaines.",
    dessusPossibles: ["ras", "court", "long"],
    profil: { fade: "bas", skin: false },
    seo: "Dégradé bas à Sète : transition courte au-dessus de l'oreille.",
  },
  {
    id: "fade-moyen",
    nom: "Fade moyen",
    repere: "1",
    repereLegende: "sabot au creux de la tempe",
    accroche: "Le classique. Celui qu'on demande en montrant son téléphone.",
    description:
      "La transition monte jusqu'au creux de la tempe. C'est le dégradé américain tel qu'on l'imagine : contraste franc, dessus libre.",
    gestes: ["Base au sabot 0,5 ou peau (au choix)", "Fondu en trois paliers, sans marche visible", "Finition au rasoir sur les contours"],
    duree: 30,
    prix: 25,
    entretienSemaines: 3,
    entretien: "À refaire toutes les 3 semaines pour garder la ligne propre.",
    dessusPossibles: ["ras", "court", "long"],
    profil: { fade: "moyen", skin: false },
    seo: "Dégradé américain moyen à Sète, finition rasoir.",
  },
  {
    id: "fade-haut",
    nom: "Skin fade haut",
    repere: "0",
    repereLegende: "à la peau, au shaver",
    accroche: "Peau nette jusqu'à la tempe. Aucun droit à l'erreur.",
    description:
      "Départ à la peau au shaver, transition haute jusqu'à la ligne du crâne. Contraste maximal avec le dessus. Le plus technique de la carte.",
    gestes: ["Peau au shaver puis sabot 0,5 · 1 · 1,5 · 2", "Fondu travaillé sur 4 paliers", "Contours au coupe-chou, lotion froide"],
    duree: 35,
    prix: 28,
    entretienSemaines: 2,
    entretien: "À refaire toutes les 2 semaines : la peau repousse vite, c'est ce qui se voit en premier.",
    dessusPossibles: ["ras", "court", "long"],
    profil: { fade: "haut", skin: true },
    seo: "Skin fade à Sète : dégradé à blanc, départ à la peau.",
  },
  {
    id: "taper",
    nom: "Taper",
    repere: "2",
    repereLegende: "sabot, pattes et nuque",
    accroche: "Juste les pattes et la nuque. Le reste ne bouge pas.",
    description:
      "Un dégradé réduit aux pattes et à la nuque. Ça repousse proprement, ça se porte long. Idéal cheveux bouclés et coupes ciseaux.",
    gestes: ["Dégradé localisé pattes + nuque", "Côtés raccourcis aux ciseaux sur peigne", "Nuque arrondie ou carrée, au choix"],
    duree: 30,
    prix: 24,
    entretienSemaines: 4,
    entretien: "À refaire toutes les 4 semaines. Le taper vieillit bien.",
    dessusPossibles: ["court", "long"],
    profil: { fade: "taper", skin: false },
    seo: "Taper fade à Sète : dégradé pattes et nuque.",
  },
  {
    id: "buzz",
    nom: "Buzz cut",
    repere: "3",
    repereLegende: "sabot, partout",
    accroche: "Vingt minutes. Zéro coiffage pendant un mois.",
    description:
      "Une seule longueur sur toute la tête, contours dessinés. On peut ajouter un dégradé bas pour casser l'effet casque.",
    gestes: ["Tondeuse au sabot choisi (1 à 4)", "Contours et nuque à la tondeuse de finition", "Option : fondu bas sur la nuque"],
    duree: 20,
    prix: 17,
    entretienSemaines: 4,
    entretien: "À refaire toutes les 3 à 4 semaines. Ou chez soi, on vous dit quel sabot.",
    dessusPossibles: ["ras"],
    profil: { fade: "aucun", skin: false },
    seo: "Buzz cut à Sète : coupe tondeuse homme.",
  },
  {
    id: "ciseaux",
    nom: "Coupe ciseaux",
    repere: "4",
    repereLegende: "centimètres, minimum",
    accroche: "Pas de tondeuse. Que du peigne et des lames.",
    description:
      "Pour les cheveux qu'on garde longs : dégradé aux ciseaux, effilage, mouvement. Coupe sur cheveux mouillés puis séchage.",
    gestes: ["Coupe sur peigne, sans tondeuse", "Effilage au rasoir pour le mouvement", "Séchage et mise en forme expliquée"],
    duree: 40,
    prix: 30,
    entretienSemaines: 6,
    entretien: "À refaire toutes les 6 semaines. Plus longtemps si vous laissez pousser.",
    dessusPossibles: ["court", "long"],
    profil: { fade: "aucun", skin: false },
    seo: "Coupe homme aux ciseaux à Sète.",
  },
];

export interface OptionDessus {
  id: DessusId;
  nom: string;
  detail: string;
  supplement: number;
  dureeSup: number;
}

export const optionsDessus: OptionDessus[] = [
  { id: "ras", nom: "Ras", detail: "Sabot 3 à 6 mm, uniforme", supplement: 0, dureeSup: 0 },
  { id: "court", nom: "Court", detail: "2 à 4 cm, ciseaux sur peigne", supplement: 0, dureeSup: 0 },
  { id: "long", nom: "Long", detail: "5 cm et plus, texturisé", supplement: 3, dureeSup: 5 },
];

export interface OptionBarbe {
  id: BarbeId;
  nom: string;
  detail: string;
  /** Prix quand ajouté à une coupe (formule) */
  prixFormule: number;
  /** Prix seul (pour afficher l'économie) */
  prixSeul: number;
  duree: number;
}

export const optionsBarbe: OptionBarbe[] = [
  { id: "aucune", nom: "Pas de barbe", detail: "On ne touche qu'aux cheveux", prixFormule: 0, prixSeul: 0, duree: 0 },
  {
    id: "taille",
    nom: "Taille de barbe",
    detail: "Ligne de joue, contours, finition coupe-chou",
    prixFormule: 10,
    prixSeul: 15,
    duree: 20,
  },
  {
    id: "rasage",
    nom: "Rasage complet",
    detail: "Serviette chaude, blaireau, coupe-chou, baume",
    prixFormule: 20,
    prixSeul: 25,
    duree: 30,
  },
];

/** Prestations hors coupe (réservables seules) */
export interface ServiceSimple {
  id: string;
  nom: string;
  detail: string;
  duree: number;
  prix: number;
}

export const servicesSimples: ServiceSimple[] = [
  { id: "barbe-taille", nom: "Taille de barbe", detail: "Ligne de joue, contours, trace, finition coupe-chou", duree: 20, prix: 15 },
  { id: "barbe-rasage", nom: "Rasage serviette chaude", detail: "Deux passages au coupe-chou, serviette chaude puis froide", duree: 30, prix: 25 },
  { id: "contours", nom: "Contours & trace", detail: "Entre deux coupes : nuque, pattes, tour d'oreille", duree: 10, prix: 8 },
  { id: "junior", nom: "Coupe moins de 16 ans", detail: "Toutes coupes tondeuse, en semaine", duree: 25, prix: 18 },
];

/** Formule mise en avant (ancrage prix) */
export const formuleVedette = {
  nom: "Coupe + barbe",
  detail: "N'importe quelle coupe tondeuse + taille de barbe complète",
  prix: 35,
  duree: 50,
  prixSepare: 25 + 15,
} as const;

export const getCoupe = (id: string | null | undefined) => coupes.find((c) => c.id === id);
export const getDessus = (id: string | null | undefined) => optionsDessus.find((d) => d.id === id);
export const getBarbe = (id: string | null | undefined) => optionsBarbe.find((b) => b.id === id);
export const getServiceSimple = (id: string | null | undefined) => servicesSimples.find((s) => s.id === id);
