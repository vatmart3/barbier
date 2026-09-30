/** Carte de fidélité (démonstration interactive). */
export const fidelite = {
  cases: 10,
  /** Tampons déjà présents sur la carte de démo */
  tamponsDemo: 6,
  recompense: "10ᵉ coupe offerte",
  regles: [
    "Un tampon par coupe, barbe comprise.",
    "Carte valable 18 mois, pas de minimum.",
    "Carte perdue ? Votre historique est dans notre planning.",
  ],
} as const;
