"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "rouge" | "creme" | "ligne" | "ligne-sombre";

interface Common {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Conservé pour compatibilité (plus d'effet magnétique) */
  magnetic?: boolean;
  /** Pleine largeur */
  pleine?: boolean;
}

type LinkProps = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

/** Boutons arrondis : plein (or), clair, ou contour or. Capitales espacées. Retour immédiat à l'appui. */
const variants: Record<Variant, string> = {
  rouge: "bg-rouge text-sur-accent hover:brightness-110",
  creme: "bg-rouge text-sur-accent hover:brightness-110",
  ligne: "border border-rouge/70 text-rouge-fonce hover:border-rouge hover:bg-rouge/10",
  "ligne-sombre": "border border-charbon/30 text-charbon hover:border-charbon/60",
};

const sizes = {
  md: "min-h-11 px-5 text-[0.8125rem] gap-2",
  lg: "min-h-13 px-7 text-[0.875rem] gap-2.5",
};

export function Bouton(props: LinkProps | ButtonProps) {
  const { variant = "rouge", size = "md", icon, iconEnd, children, className, pleine = false } = props;

  const inner = (
    <>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="whitespace-nowrap font-semibold uppercase tracking-[0.08em]">{children}</span>
      {iconEnd ? <span className="shrink-0 transition-transform duration-300 ease-(--ease-out-cut) group-hover:translate-x-0.5">{iconEnd}</span> : null}
    </>
  );

  const cls = cn(
    "group inline-flex items-center justify-center rounded-xl transition-[filter,opacity,background-color,border-color,transform] duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    pleine && "w-full",
    className,
  );

  if (props.href !== undefined) {
    if (props.external || /^(tel:|mailto:|https?:)/.test(props.href)) {
      return (
        <a {...stripCommon(props)} href={props.href} className={cls} {...(props.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inner}
        </a>
      );
    }
    return (
      <Link {...stripCommon(props)} href={props.href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button {...stripCommon(props)} type={(props as ButtonProps).type ?? "button"} className={cls}>
      {inner}
    </button>
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
