"use client";

/**
 * Profil gravé ANIMÉ (configurateur) : les tracés se transforment
 * (morphing Motion) quand les paramètres changent. Pour un affichage fixe,
 * utiliser <ProfilStatique> (rendu serveur, aucun JS).
 */
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { ease } from "@/design/motion";
import { renduProfil, type ProfilOptions } from "./profil-rendu";

export function ProfilTete(props: ProfilOptions) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:«»]/g, "");
  const t = reduce ? { duration: 0 } : { duration: 0.7, ease: ease.outCut };
  return renduProfil(props, uid, {
    Trace: ({ d, ...rest }) => <motion.path initial={false} animate={{ d }} transition={t} {...rest} />,
    Fondu: ({ y, opacity, fill }) => <motion.rect x="0" width="400" height="340" fill={fill} initial={false} animate={{ y, opacity }} transition={t} />,
    Opacite: ({ opacity, children }) => (
      <motion.g initial={false} animate={{ opacity }} transition={t}>
        {children}
      </motion.g>
    ),
    Repere: ({ y, opacity, children }) => (
      <motion.g initial={false} animate={{ y, opacity }} transition={t}>
        {children}
      </motion.g>
    ),
  });
}
