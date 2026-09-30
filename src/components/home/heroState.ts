/** État partagé hero ⇄ scène 3D, muté par ScrollTrigger (pas de re-rendu React). */
export const heroState = {
  /** Progression du scroll dans le hero, 0 → 1 */
  p: 0,
  /** Pointeur normalisé -1 → 1 */
  px: 0,
  py: 0,
};

/** Découpe diagonale : du bord droit (18 %) au bord gauche (82 %) */
export const CUT = { right: 18, left: 82 } as const;
