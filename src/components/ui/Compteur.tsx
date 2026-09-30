/**
 * Valeur chiffrée (prix, durée, créneau) : chiffres tabulaires, affichée
 * telle quelle. Pas d'animation de rouleau : la valeur est toujours juste,
 * y compris sans JS, en capture d'écran ou à l'impression.
 */
import { cn } from "@/lib/cn";

interface Props {
  value: string | number;
  className?: string;
  /** Conservés pour compatibilité, sans effet */
  delay?: number;
  duration?: number;
}

export function Compteur({ value, className }: Props) {
  return <span className={cn("tabular", className)}>{String(value)}</span>;
}
