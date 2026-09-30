"use client";

/**
 * Menu plein écran (mobile / tablette). Chaque entrée porte un numéro de sabot.
 * Ouverture : coupe diagonale depuis le coin haut droit.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { directionsUrl, fullAddress, nav, site, telHref } from "@/config/site";
import { ease } from "@/design/motion";
import { IconFermer } from "@/components/ui/Icons";
import { useLenis } from "./SmoothScroll";

export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const last = useRef(pathname);

  // Fermeture à la navigation
  useEffect(() => {
    if (last.current !== pathname) {
      last.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>("a,button")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      prev?.focus?.();
    };
  }, [open, onClose, lenis]);

  const items = [...nav, { href: "/reserver", label: "Réserver", sabot: "4" }];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={ref}
          id="menu-principal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-charbon text-creme"
          initial={reduce ? { opacity: 0 } : { clipPath: "polygon(100% 0, 100% 0, 100% 0, 100% 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "polygon(-60% 0, 100% 0, 100% 160%, 100% 160%)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "polygon(100% 0, 100% 0, 100% 0, 100% 0)" }}
          transition={{ duration: 0.6, ease: ease.blade }}
          data-lenis-prevent
        >
          <div className="container-page flex h-(--header-h) items-center justify-between">
            <span className="font-display text-[1.9rem] leading-none">Dégradé</span>
            <button type="button" onClick={onClose} className="-mr-2 inline-flex size-11 items-center justify-center" aria-label="Fermer le menu">
              <IconFermer size={24} />
            </button>
          </div>
          <nav aria-label="Menu mobile" className="container-page flex-1 overflow-y-auto pt-6">
            <ul className="border-t border-creme/10">
              {items.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="border-b border-creme/10">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="-mt-[0.2em] block overflow-hidden pt-[0.2em]">
                        <motion.span
                          className={`block font-display text-d1 ${item.href === "/reserver" ? "text-rouge" : ""}`}
                          initial={reduce ? false : { y: "110%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 0.7, ease: ease.outCut, delay: 0.18 + i * 0.05 }}
                        >
                          {item.label}
                        </motion.span>
                      </span>
                      <span className="eyebrow tabular text-acier">sabot {item.sabot}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="container-page grid grid-cols-2 gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-sm">
            <a href={telHref} className="flex min-h-11 flex-col justify-center">
              <span className="eyebrow text-acier">Appeler</span>
              <span className="tabular">{site.phone.display}</span>
            </a>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 flex-col justify-center">
              <span className="eyebrow text-acier">Itinéraire</span>
              <span>{fullAddress}</span>
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
