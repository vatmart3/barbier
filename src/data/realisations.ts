/**
 * Avant / après. Chaque réalisation est dessinée par le profil SVG paramétrique.
 * Pour utiliser de vraies photos : renseigner `photos` (fichiers dans /public),
 * le composant les affichera à la place des illustrations.
 */
import type { BarbierId } from "./barbiers";
import type { ProfilParams } from "@/components/illustrations/profil-types";

export interface Realisation {
  id: string;
  titre: string;
  barbier: BarbierId;
  duree: number;
  note: string;
  avant: ProfilParams;
  apres: ProfilParams;
  photos?: { avant: string; apres: string; alt: string };
}

export const realisations: Realisation[] = [
  {
    id: "skin-fade",
    titre: "Skin fade haut, dessus texturé",
    barbier: "karim",
    duree: 35,
    note: "Deux mois sans coupe. Départ à la peau, 4 paliers, contours au rasoir.",
    avant: { fade: "aucun", skin: false, dessus: "long", barbe: "pleine", negliges: true },
    apres: { fade: "haut", skin: true, dessus: "court", barbe: "pleine" },
  },
  {
    id: "taper-barbe",
    titre: "Taper + taille de barbe",
    barbier: "theo",
    duree: 50,
    note: "Barbe de trois mois ramenée à une ligne de joue nette. Nuque arrondie.",
    avant: { fade: "aucun", skin: false, dessus: "long", barbe: "pleine", negliges: true },
    apres: { fade: "taper", skin: false, dessus: "long", barbe: "taille" },
  },
  {
    id: "fade-moyen",
    titre: "Fade moyen, dessus court",
    barbier: "lucas",
    duree: 30,
    note: "Le classique du vendredi soir. Sabot 0,5 en base, transition au creux de la tempe.",
    avant: { fade: "aucun", skin: false, dessus: "long", barbe: "aucune", negliges: true },
    apres: { fade: "moyen", skin: false, dessus: "court", barbe: "aucune" },
  },
  {
    id: "rasage",
    titre: "Rasage serviette chaude",
    barbier: "karim",
    duree: 30,
    note: "Barbe de dix jours, deux passages au coupe-chou. Peau nette, zéro feu.",
    avant: { fade: "bas", skin: false, dessus: "court", barbe: "pleine", negliges: false },
    apres: { fade: "bas", skin: false, dessus: "court", barbe: "rasage" },
  },
];
