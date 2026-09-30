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
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-vu", "");
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
        io.observe(el);
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
