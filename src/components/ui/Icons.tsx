/**
 * Pictos dessinés pour Dégradé : trait 1,5 px, extrémités et angles arrondis
 * pour aller avec le reste du site.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

/** Combiné téléphonique de salon */
export const IconTel = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4h3.5l1.5 4.5-2.2 1.3a10 10 0 0 0 6.4 6.4l1.3-2.2L20 15.5V19a1 1 0 0 1-1 1C11.3 20 4 12.7 4 5a1 1 0 0 1 1-1Z" />
  </svg>
);

/** Itinéraire : repère + chemin en pointillé */
export const IconRoute = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M17 3.5a3.5 3.5 0 0 1 3.5 3.5c0 2.6-3.5 6-3.5 6s-3.5-3.4-3.5-6A3.5 3.5 0 0 1 17 3.5Z" />
    <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    <path d="M17 16v1.5a3 3 0 0 1-3 3H8.5a2.5 2.5 0 0 1 0-5h2a2.5 2.5 0 0 0 0-5H5" strokeDasharray="2 2.2" />
    <path d="M3.5 10.5h3" />
  </svg>
);

/** Rasoir coupe-chou ouvert */
export const IconRasoir = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 9.5h11.5c1.8 0 3 1 3 2.5v.5H6.5A3.5 3.5 0 0 1 3 9.5Z" />
    <path d="M17.5 12.5 21 16" />
    <path d="M14.5 9.5 21 8.5" />
    <circle cx="16" cy="11" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCiseaux = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="6" cy="6.5" r="2.5" />
    <circle cx="6" cy="17.5" r="2.5" />
    <path d="M8.2 7.8 20 16M8.2 16.2 20 8" />
  </svg>
);

/** Tondeuse de profil */
export const IconTondeuse = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8 21h8l1-12H7l1 12Z" />
    <path d="M7 9V5h10v4" />
    <path d="M8.5 3h7M9.5 5V3M12 5V3M14.5 5V3" />
    <path d="M12 13v4" />
  </svg>
);

export const IconHorloge = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconCalendrier = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 6h16v14H4zM4 10h16M8 3.5V7M16 3.5V7" />
    <path d="M8 14h2M14 14h2M8 17h2" />
  </svg>
);

/** Flèche fine, longue, comme un dos de lame */
export const IconFleche = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} viewBox="0 0 32 24">
    <path d="M2 12h27M22 5l7 7-7 7" />
  </svg>
);

export const IconFermer = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

/** Menu : trois passages de tondeuse de longueurs inégales */
export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 7h18M3 12h13M3 17h8" />
  </svg>
);

export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12.5 9.5 18 20 6.5" />
  </svg>
);

/** Serviette chaude (vapeur) */
export const IconServiette = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 14h16v6H4z" />
    <path d="M4 17h16" strokeDasharray="1.5 2" />
    <path d="M8 11c-1.2-1.2 1.2-2 0-3.5M12 11c-1.2-1.2 1.2-2 0-3.5M16 11c-1.2-1.2 1.2-2 0-3.5" strokeLinecap="round" />
  </svg>
);

export const IconMail = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3.5 5.5h17v13h-17z" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);

export const IconTelecharger = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5v12M6.5 10 12 15.5 17.5 10M4 20.5h16" />
  </svg>
);

export const IconInstagram = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14 21v-7.5h2.6l.4-3H14V8.7c0-.9.3-1.5 1.6-1.5H17V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8.3v3h2.6V21" strokeLinecap="round" />
  </svg>
);

export const IconTiktok = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3M14 3.5c.4 2.6 2.2 4.4 5 4.6" strokeLinecap="round" />
  </svg>
);

export const IconChevron = ({ size, dir = "droite", ...p }: P & { dir?: "gauche" | "droite" }) => (
  <svg {...base(size)} {...p}>
    <path d={dir === "droite" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
  </svg>
);
