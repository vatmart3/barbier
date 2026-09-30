import type { BarbeId, DessusId, FadeLevel } from "@/data/prestations";

export interface ProfilParams {
  fade: FadeLevel;
  /** Départ à la peau (skin fade) */
  skin: boolean;
  dessus: DessusId;
  barbe: BarbeId | "pleine";
  moustache?: boolean;
  /** Cheveux trop longs, avant la coupe */
  negliges?: boolean;
  /** Trace au rasoir sur le côté */
  trace?: boolean;
}
