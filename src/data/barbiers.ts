/**
 * L'équipe. Profils fictifs de démonstration — à remplacer par l'équipe réelle.
 * `jours` : jours travaillés (les horaires suivent ceux du salon, sauf
 * `horairesPerso`). Le planning (créneaux pris) est dans planning.ts.
 */
import type { DayKey } from "@/config/site";
import type { BarbeId, DessusId, FadeLevel } from "./prestations";

export type BarbierId = "karim" | "theo" | "lucas";

export interface Barbier {
  id: BarbierId;
  prenom: string;
  role: string;
  depuis: number;
  specialite: string;
  style: string;
  bio: string[];
  signature: string;
  outil: string;
  /** Réplique qui donne le ton (humour sec) */
  replique: string;
  /** Ce qui passe dans le salon quand il coupe */
  ambiance: string;
  /** Teinte douce du fond de portrait */
  teinte: string;
  jours: DayKey[];
  /** Surcharge horaire par jour (sinon horaires du salon) */
  horairesPerso?: Partial<Record<DayKey, { open: string; close: string }>>;
  /** Paramètres du portrait gravé (profil SVG) */
  portrait: { fade: FadeLevel; skin: boolean; dessus: DessusId; barbe: BarbeId | "pleine"; moustache?: boolean };
  alt: string;
}

export const barbiers: Barbier[] = [
  {
    id: "karim",
    prenom: "Karim",
    role: "Fondateur",
    depuis: 2011,
    specialite: "Skin fade & barbe au coupe-chou",
    style: "Précis, peu bavard, obsédé par la symétrie des pattes.",
    bio: [
      "Quinze ans de tondeuse, dont six à Montpellier avant d'ouvrir Grand'Rue en 2019.",
      "C'est lui qui fait les rasages serviette chaude du samedi matin. Il affûte ses lames sur cuir tous les jours à 8 h 45.",
    ],
    signature: "Skin fade haut, ligne de barbe au rasoir",
    outil: "Coupe-chou lame 6/8, manche corne",
    replique: "« Une patte plus haute que l'autre, c'est une coupe à refaire. Chez moi, ça n'arrive pas. »",
    ambiance: "Brassens, forcément : on est à Sète.",
    teinte: "#efe7dd",
    jours: ["mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    portrait: { fade: "haut", skin: true, dessus: "court", barbe: "pleine" },
    alt: "Portrait gravé de Karim, barbier fondateur de Dégradé à Sète, skin fade et barbe taillée",
  },
  {
    id: "theo",
    prenom: "Théo",
    role: "Barbier",
    depuis: 2016,
    specialite: "Taper & coupes ciseaux",
    style: "Patient avec les cheveux bouclés, bavard sur le rugby.",
    bio: [
      "Formé en salon mixte à Montpellier : il coupe aux ciseaux ce que d'autres rasent par défaut.",
      "Référent cheveux bouclés et frisés. Il fait aussi la nocturne du jeudi jusqu'à 21 h.",
    ],
    signature: "Taper nuque arrondie, dessus texturisé",
    outil: "Ciseaux 6 pouces + effileur",
    replique: "« Vous voulez court ? Montrez-moi avec les doigts. Non, pas comme ça. »",
    ambiance: "Le rugby à la radio le samedi, le son baissé pendant les contours.",
    teinte: "#e4e9ee",
    jours: ["mardi", "jeudi", "vendredi", "samedi"],
    horairesPerso: { mardi: { open: "12:00", close: "19:00" } },
    portrait: { fade: "taper", skin: false, dessus: "long", barbe: "aucune", moustache: true },
    alt: "Portrait gravé de Théo, barbier à Sète spécialiste du taper et des coupes ciseaux",
  },
  {
    id: "lucas",
    prenom: "Lucas",
    role: "Barbier",
    depuis: 2020,
    specialite: "Fades contrastés & traces",
    style: "Le plus jeune. Dessine des traces au rasoir pendant sa pause.",
    bio: [
      "CAP à Montpellier, champion de Sète de la patience avec les 16 ans qui veulent « comme le joueur, là ».",
      "Il fait les traces et motifs à la main levée : une ligne, deux, un éclair si vous insistez.",
    ],
    signature: "Fade moyen, trace au rasoir",
    outil: "Tondeuse de finition lame T",
    replique: "« Une trace, c'est comme un tatouage qui repousse. On peut se tromper une fois. »",
    ambiance: "Du rap marseillais, pas trop fort, promis.",
    teinte: "#e6ebe2",
    jours: ["mercredi", "jeudi", "vendredi", "samedi"],
    horairesPerso: { jeudi: { open: "10:00", close: "19:00" } },
    portrait: { fade: "moyen", skin: false, dessus: "ras", barbe: "aucune" },
    alt: "Portrait gravé de Lucas, barbier à Sète spécialiste des dégradés contrastés et des traces",
  },
];

export const getBarbier = (id: string | null | undefined) => barbiers.find((b) => b.id === id);
