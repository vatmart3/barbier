/**
 * AVIS DE DÉMONSTRATION — À REMPLACER PAR LES VRAIS AVIS DU CLIENT.
 * Ne jamais publier ces textes pour un vrai salon. Ne pas afficher de logo
 * ou de note « Google » : recopiez les avis réels avec l'accord de leurs auteurs.
 */
import type { BarbierId } from "./barbiers";

export interface Avis {
  auteur: string;
  ville: string;
  coupe: string;
  barbier: BarbierId;
  texte: string;
  date: string;
  clientDepuis?: number;
}

export const avis: Avis[] = [
  {
    auteur: "Yanis B.",
    ville: "Sète, quartier Haut",
    coupe: "Skin fade haut",
    barbier: "karim",
    texte: "Pas une marche dans le dégradé, même en plein soleil sur la Corniche. Karim ne parle pas beaucoup mais il regarde vos pattes comme un géomètre.",
    date: "septembre 2026",
    clientDepuis: 2020,
  },
  {
    auteur: "Mathieu R.",
    ville: "Frontignan",
    coupe: "Taper + coupe ciseaux",
    barbier: "theo",
    texte: "Le premier qui ne rase pas mes boucles par réflexe. Théo coupe à sec, explique ce qu'il fait, et ça tient six semaines.",
    date: "août 2026",
    clientDepuis: 2023,
  },
  {
    auteur: "Samir K.",
    ville: "Balaruc-les-Bains",
    coupe: "Rasage serviette chaude",
    barbier: "karim",
    texte: "Offert par ma femme pour mes 40 ans. Je le repaie moi-même tous les mois depuis. Deux passages, zéro feu du rasoir.",
    date: "juillet 2026",
    clientDepuis: 2024,
  },
  {
    auteur: "Enzo P.",
    ville: "Sète, La Pointe Courte",
    coupe: "Fade moyen + trace",
    barbier: "lucas",
    texte: "J'ai montré une photo floue d'un joueur. Lucas a fait mieux que la photo et m'a déconseillé l'éclair. Il avait raison.",
    date: "septembre 2026",
  },
  {
    auteur: "Hugo D.",
    ville: "Mèze",
    coupe: "Coupe + barbe",
    barbier: "theo",
    texte: "Réservé à 18 h 50 pour la nocturne du jeudi, assis à 19 h 20. Vingt minutes de route depuis Mèze, et ça les vaut.",
    date: "juin 2026",
    clientDepuis: 2022,
  },
  {
    auteur: "Karl M.",
    ville: "Sète, Île Sud",
    coupe: "Buzz cut",
    barbier: "lucas",
    texte: "Vingt minutes, montre en main. Il m'a dit quel sabot acheter pour entretenir chez moi. Je reviens quand même, c'est plus propre.",
    date: "mai 2026",
  },
];

