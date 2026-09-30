"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { spring } from "@/design/motion";
import { useFinePointer, useReducedMotionPref } from "@/hooks/useMedia";

type Variant = "rouge" | "creme" | "ligne" | "ligne-sombre";

interface Common {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Effet magnétique discret (pointeur fin uniquement) */
  magnetic?: boolean;
  /** Pleine largeur */
  pleine?: boolean;
}

type LinkProps = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

const variants: Record<Variant, string> = {
  rouge: "bg-rouge text-creme [--wipe:var(--color-creme)] hover:text-charbon",
  creme: "bg-creme text-charbon [--wipe:var(--color-rouge)] hover:text-creme",
  ligne: "border border-creme/40 text-creme [--wipe:var(--color-creme)] hover:text-charbon hover:border-creme",
  "ligne-sombre": "border border-charbon/35 text-charbon [--wipe:var(--color-charbon)] hover:text-creme hover:border-charbon",
};

const sizes = {
  md: "min-h-11 px-5 text-sm gap-3",
  lg: "min-h-14 px-7 text-base gap-4",
};

export function Bouton(props: LinkProps | ButtonProps) {
  const { variant = "rouge", size = "md", icon, iconEnd, children, className, magnetic = true, pleine = false } = props;
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const active = magnetic && fine && !reduce;
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), spring.magnetic);
  const y = useSpring(useMotionValue(0), spring.magnetic);

  const onMove = (e: React.PointerEvent) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      {/* Coup de lame : le fond est balayé en diagonale au survol */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-(--wipe) transition-[clip-path] duration-500 ease-(--ease-blade) [clip-path:polygon(0_100%,0_100%,0_100%,0_100%)] group-hover:[clip-path:polygon(0_0,130%_0,100%_100%,0_100%)] group-focus-visible:[clip-path:polygon(0_0,130%_0,100%_100%,0_100%)]"
      />
      {icon ? <span className="relative shrink-0">{icon}</span> : null}
      <span className="relative font-semibold tracking-wide">{children}</span>
      {iconEnd ? (
        <span className="relative shrink-0 transition-transform duration-300 ease-(--ease-out-cut) group-hover:translate-x-1">{iconEnd}</span>
      ) : null}
    </>
  );

  const cls = cn(
    "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-xs uppercase transition-colors duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    pleine && "w-full",
    className,
  );

  const content =
    props.href !== undefined ? (
      props.external || /^(tel:|mailto:|https?:)/.test(props.href) ? (
        <a {...stripCommon(props)} href={props.href} className={cls} {...(props.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inner}
        </a>
      ) : (
        <Link {...stripCommon(props)} href={props.href} className={cls}>
          {inner}
        </Link>
      )
    ) : (
      <button {...stripCommon(props)} type={(props as ButtonProps).type ?? "button"} className={cls}>
        {inner}
      </button>
    );

  return (
    <motion.span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} style={active ? { x, y } : undefined} className={pleine ? "flex w-full" : "inline-flex"}>
      {content}
    </motion.span>
  );
}

function stripCommon<T extends Common>(p: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant, size, icon, iconEnd, children, className, magnetic, pleine, ...rest } = p as T & { external?: boolean; href?: string };
  const r = rest as Record<string, unknown>;
  delete r.external;
  delete r.href;
  return r;
}
