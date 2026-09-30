"use client";

/** Passages de tondeuse : lignes fines de longueurs inégales, tracées à l'entrée. */
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { ease } from "@/design/motion";

const LONGUEURS = [1, 0.82, 0.93, 0.61, 0.88, 0.4, 0.74];

export function Traces({ count = 5, className, origin = "left" }: { count?: number; className?: string; origin?: "left" | "right" }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={cn("flex flex-col gap-[5px]", className)}>
      {LONGUEURS.slice(0, count).map((l, i) => (
        <motion.span
          key={i}
          className="block h-px bg-current"
          style={{ width: `${l * 100}%`, transformOrigin: origin, marginLeft: origin === "right" ? "auto" : undefined }}
          initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
          whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: ease.blade, delay: i * 0.07 }}
        />
      ))}
    </div>
  );
}
