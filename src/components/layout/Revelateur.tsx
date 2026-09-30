"use client";

/**
 * Un seul IntersectionObserver pour tout le site : pose [data-vu] sur les
 * éléments [data-reveal] quand ils entrent à l'écran. Les animations sont en
 * CSS (globals.css). Démarre une fois la page hydratée (aucune modification
 * du HTML serveur avant que React l'ait repris).
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };

export function Revelateur() {
  const pathname = usePathname();
  useEffect(() => {
    // Un élément entièrement rogné (clip-path) n'intersecte jamais : on observe
    // alors son parent, et on révèle l'élément quand le parent entre à l'écran.
    const cibles = new Map<Element, Element[]>();
    const suivis = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (cibles.get(e.target) ?? [e.target]).forEach((el) => el.setAttribute("data-vu", ""));
            cibles.delete(e.target);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    let raf = 0;
    const scan = () => {
      raf = 0;
      document.querySelectorAll("[data-reveal]:not([data-vu])").forEach((el) => {
        if (suivis.has(el)) return;
        suivis.add(el);
        const rogne = /^(clip|monte)/.test(el.getAttribute("data-reveal") ?? "");
        const obs = rogne && el.parentElement ? el.parentElement : el;
        if (obs !== el) cibles.set(obs, [...(cibles.get(obs) ?? []), el]);
        io.observe(obs);
      });
    };
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(scan);
    });
    const w = window as IdleWindow;
    const demarrer = () => {
      scan();
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const id = w.requestIdleCallback ? w.requestIdleCallback(demarrer, { timeout: 1200 }) : window.setTimeout(demarrer, 300);
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);
  return null;
}
