"use client";

/**
 * Un seul IntersectionObserver pour tout le site : pose [data-vu] sur les
 * éléments [data-reveal] quand ils entrent à l'écran. Les animations sont en
 * CSS (globals.css) — aucune bibliothèque, aucune hydratation par section.
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Revelateur() {
  const pathname = usePathname();
  useEffect(() => {
    // Un élément entièrement rogné (clip-path) n'intersecte jamais : on observe
    // alors son parent, et on révèle l'élément quand le parent entre à l'écran.
    const cibles = new Map<Element, Element[]>();
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
      document.querySelectorAll("[data-reveal]:not([data-vu]):not([data-observe])").forEach((el) => {
        el.setAttribute("data-observe", "");
        const rogne = /^(clip|monte)/.test(el.getAttribute("data-reveal") ?? "");
        const obs = rogne && el.parentElement ? el.parentElement : el;
        if (obs !== el) cibles.set(obs, [...(cibles.get(obs) ?? []), el]);
        io.observe(obs);
      });
    };
    scan();
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      document.querySelectorAll("[data-observe]").forEach((el) => el.removeAttribute("data-observe"));
    };
  }, [pathname]);
  return null;
}
