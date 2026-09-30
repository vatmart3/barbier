"use client";

/**
 * Loader d'entrée (~1,3 s) : les numéros de sabot défilent 3 → 2 → 1 → 0,5
 * pendant qu'un passage de tondeuse (trait rouge) balaie l'écran.
 * Animation 100 % CSS (globals.css) : elle ne dépend pas de l'hydratation.
 * Une seule fois par session (sessionStorage + script inline dans <head>).
 */
import { useEffect, useState } from "react";

export const LOADER_FLAG = "dg-seen";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    try {
      sessionStorage.setItem(LOADER_FLAG, "1");
    } catch {}
    const t = window.setTimeout(() => {
      document.documentElement.setAttribute("data-seen", "");
      setDone(true);
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <div className="loader" aria-hidden>
      <div className="loader__pass" />
      <div className="loader__stack font-display">
        <div className="loader__reel tabular">
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0,5</span>
        </div>
      </div>
      <div className="loader__label eyebrow">
        <span>Dégradé — Barbier, Sète</span>
        <span>Sabot</span>
      </div>
    </div>
  );
}

/** Script inline : masque le loader dès le premier octet si déjà vu. */
export const loaderScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("${LOADER_FLAG}"))document.documentElement.setAttribute("data-seen","")}catch(e){}`;

/** Le loader a-t-il été affiché à ce chargement ? (pour décaler l'intro du hero) */
export const loaderDelay = () =>
  typeof document !== "undefined" && !document.documentElement.hasAttribute("data-seen") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 1.15
    : 0;
