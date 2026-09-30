/**
 * Profil gravé STATIQUE : rendu côté serveur, zéro JavaScript envoyé.
 * `id` doit être unique dans la page (identifiants des motifs SVG).
 */
import { renduProfil, type ProfilOptions } from "./profil-rendu";

export function ProfilStatique({ id, ...props }: ProfilOptions & { id: string }) {
  return renduProfil(props, `ps-${id}`, {
    Trace: ({ d, ...rest }) => <path d={d} {...rest} />,
    Fondu: ({ y, opacity, fill }) => <rect x="0" y={y} width="400" height="340" fill={fill} opacity={opacity} />,
    Opacite: ({ opacity, children }) => <g opacity={opacity}>{children}</g>,
    Repere: ({ y, opacity, children }) => (
      <g transform={`translate(0 ${y})`} opacity={opacity}>
        {children}
      </g>
    ),
  });
}
