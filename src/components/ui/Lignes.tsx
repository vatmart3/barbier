"use client";

/**
 * Masques de texte ligne par ligne : chaque ligne remonte de sous sa propre
 * arête, comme un peigne qui dégage la nuque.
 */
import { motion, useReducedMotion } from "motion/react";
import { createElement, type ReactNode } from "react";
import { ease, transition } from "@/design/motion";
import { cn } from "@/lib/cn";

interface Props {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  id?: string;
}

export function Lignes({ lines, as = "h2", className, lineClassName, delay = 0, stagger = 0.08, id }: Props) {
  const reduce = useReducedMotion();
  return createElement(
    as,
    { className, id },
    lines.map((line, i) => (
      <span key={i} className={cn("-mb-[0.08em] -mt-[0.2em] block overflow-hidden pb-[0.08em] pt-[0.2em]", lineClassName)}>
        <motion.span
          className="block will-change-transform"
          initial={{ y: "108%", rotate: 1.5, opacity: 0 }}
          whileInView={{ y: "0%", rotate: 0, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={transition(reduce, { duration: 0.9, ease: ease.outCut, delay: delay + i * stagger, opacity: { duration: 0.4, delay: delay + i * stagger } })}
        >
          {line}
        </motion.span>
      </span>
    )),
  );
}
