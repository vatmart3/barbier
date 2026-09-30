/**
 * Équivalents JS des tokens de mouvement de src/design/tokens.css.
 * Motion (Framer) prend des tableaux de Bézier, GSAP des chaînes CustomEase-like.
 */

export const ease = {
  blade: [0.7, 0, 0.2, 1],
  outCut: [0.16, 1, 0.3, 1],
  inCut: [0.55, 0, 0.9, 0.35],
  thud: [0.34, 1.56, 0.64, 1],
  comb: [0.45, 0.05, 0.25, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** Durées en secondes (Motion / GSAP). */
export const duration = {
  snap: 0.2,
  ui: 0.32,
  reveal: 0.7,
  long: 1.1,
} as const;

export const spring = {
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
  soft: { stiffness: 120, damping: 20, mass: 0.8 },
} as const;

/**
 * Transition « mouvement réduit » : les états initiaux restent identiques
 * côté serveur et client (pas d'écart d'hydratation) ; seul le déroulé change —
 * déplacements instantanés, simple fondu sur l'opacité.
 */
export function transition<T extends object>(reduce: boolean | null, normal: T) {
  return reduce ? { default: { duration: 0 }, opacity: { duration: 0.3 } } : normal;
}
