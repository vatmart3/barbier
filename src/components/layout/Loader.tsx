/**
 * Plus de loader d'entrée (style épuré) : ce module ne garde que le script
 * inline du <head> (classe .js pour les révélations CSS) et le délai d'intro.
 */

/** Script inline : active les révélations CSS (sans JS, rien n'est masqué). */
export const loaderScript = `document.documentElement.classList.add("js");`;

/** Délai avant l'intro du hero (secondes). */
export const loaderDelay = () => 0;
