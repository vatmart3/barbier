# PLAN — DÉGRADÉ · Barbier, Sète

Site vitrine de démonstration — portfolio MJAGENCY (site 02/10).
Concept : **« la chaise »**. Le site se regarde depuis le fauteuil du barbier : on pivote (sections en défilement horizontal), on se regarde dans le miroir (avant / après), on repart avec sa carte tamponnée.

---

## 1. Arborescence

```
/                     Accueil
/coupes               Les coupes + configurateur + calculateur d'entretien
/equipe               L'équipe (fiches barbiers, dispos de la semaine)
/reserver             Réservation en 3 étapes (pré-remplissable via ?coupe=…)
/infos                Horaires, accès, FAQ, question rapide
/mentions-legales     Mentions légales (champs client à compléter)
/confidentialite      Politique de confidentialité RGPD + gestion cookies
/api/reservation      POST — validation zod + Resend ou mode démo
/api/contact          POST — idem
sitemap.xml · robots.txt · manifest.webmanifest · OG image par page
```

```
src/
  config/site.ts          NAP, horaires, réseaux, SEO — UN SEUL fichier client
  data/*.ts               prestations, barbiers, planning, avis, faq, réalisations, configurateur, fidélité
  design/tokens.css       tokens (couleurs, typo, espacements, rayons, ombres, easings, durées)
  design/motion.ts        mêmes easings / durées côté JS (Motion + GSAP)
  lib/                    heure de Paris, moteur de créneaux, tarifs, .ics, schémas zod, JSON-LD, OG
  components/
    layout/               header, pastille créneau, enseigne 3D, menu, CTA mobile, footer, loader, grain, cookies
    ui/                   liens magnétiques, compteur mécanique, masques de lignes, texte gravé, traces
    three/                rasoir coupe-chou, enseigne (R3F) + détection WebGL / tier appareil
    illustrations/        profil de tête paramétrique, rasoir SVG (fallback), carte de Sète, pictos maison
    home/ coupes/ equipe/ reservation/ infos/
```

## 2. Accueil — découpage et animation de chaque section

| # | Section | Contenu | Animation d'entrée (unique) |
|---|---------|---------|-----------------------------|
| 0 | Loader (< 1,3 s) | Numéros de sabot 3 → 2 → 1 → 0,5 qui défilent, trait rouge de tondeuse qui balaie | CSS pur (indépendant de l'hydratation), une fois par session |
| 1 | **Hero « Rasoir »** | « DÉGRADÉ » géant rogné, échelle des sabots, rasoir 3D | Sticky 200 vh : la lame s'ouvre, trace une diagonale rouge, le hero se fend en deux moitiés (clip-path GSAP) qui glissent |
| 2 | Prochain créneau libre | Heure calculée en direct, barbier, 3 créneaux suivants | Apparaît *sous* les deux moitiés ; chiffres en compteur mécanique |
| 3 | Les coupes | 6 panneaux : numéro de sabot énorme, profil SVG, durée, prix, entretien | **Pin + défilement horizontal** (le fauteuil pivote) ; dernier panneau = entrée du configurateur |
| 4 | Les barbiers | Karim, Théo, Lucas | Noms **gravés** (stroke-dashoffset SVG puis remplissage) |
| 5 | Avant / après | 4 réalisations | Révélation clip-path + curseur en forme de lame |
| 6 | Tarifs | Planche de tarifs + formule Coupe + barbe | Prix et durées en **compteur mécanique** |
| 7 | Fidélité | Carte 10 cases | Tampons qui tombent au rythme du scroll (scrub), bouton « tamponner » |
| 8 | Avis | « Entendu au fauteuil » : index typographique | Lignes qui glissent en alternance gauche / droite, masque horizontal |
| 9 | Accès | Carte SVG de Sète dessinée, horaires, ouvert / fermé en direct | Tracé du canal et des rues (dessin progressif) |

## 3. Moment 3D signature

- **Rasoir coupe-chou procédural** (R3F) : lame `ExtrudeGeometry` biseautée en acier poli (`MeshPhysicalMaterial`, métal 1, rugosité 0,12), talon + crans, axe, manche en corne sombre (texture de veinage générée en canvas, clearcoat). Environnement de reflets **Lightformer** (aucune HDR téléchargée).
- Flotte, suit la souris (lerp), `dpr` ≤ 1,5, `frameloop` coupé hors écran.
- Scroll : progression 0 → 0,35 ouverture de la lame · 0,35 → 0,55 coup diagonal + trait rouge SVG · 0,55 → 1 les deux moitiés du hero glissent (clip-path polygon) et révèlent « Prochain créneau ».
- **Enseigne de barbier** (cylindre, spirale en shader GLSL) dans le header : la spirale tourne avec le scroll = indicateur de progression.
- Fallbacks : rasoir SVG gravé / enseigne SVG si pas de WebGL, `prefers-reduced-motion`, `hardwareConcurrency ≤ 4` ou `deviceMemory ≤ 4`. 3D chargée en différé (`dynamic`, après interaction ou inactivité).

## 4. Fonctionnalités métier

1. **Configurateur** (coupe × dessus × barbe) — profil SVG qui se met à jour (hauteur du dégradé, volume du dessus, barbe), prix / durée recalculés, barre de progression 3 étapes, « Réserver cette coupe » → `/reserver?…`.
2. **Réservation** en 3 étapes : prestation + barbier (ou « le premier dispo ») → date + créneau (créneaux pris rayés, calculés depuis `planning.ts` et l'heure réelle de Paris) → coordonnées + récap. Succès : ticket, `.ics`, Google Agenda, itinéraire, chrono « réservé en 41 s ».
3. **Avant / après** 4 réalisations, curseur lame, clavier (flèches).
4. **Carte de fidélité** démo, tampons animés, 10ᵉ coupe offerte.
5. **Calculateur d'entretien** (réciprocité) : dernière coupe → date conseillée du prochain passage + rappel `.ics`.

## 5. Leviers de conversion

- Pastille header « Prochain créneau : aujourd'hui 17 h 40 avec Théo » (données + heure réelle).
- Réservation en 3 clics minimum depuis n'importe quelle page ; barre de progression 3 étapes.
- CTA collant mobile : Réserver / Appeler / Itinéraire.
- Micro-engagement : configurateur (Zeigarnik) avec progression.
- Ancrage : formule Coupe + barbe 35 € face à 25 € + 15 € (économie 5 € affichée).
- Preuve sociale honnête : avis démo signalés comme tels dans `avis.ts`, chiffres concrets.
- Réciprocité : calculateur d'entretien + conseils entre deux coupes, sans rien demander.
- Réassurance : « on rappelle sous 2 h », annulation gratuite jusqu'à 2 h avant, paiement CB / espèces.
- Rareté réelle uniquement : nombre de créneaux restants aujourd'hui calculé depuis le planning.

## 6. SEO local

Mots-clés : barbier Sète · barbershop Sète · coiffeur homme Sète · dégradé américain Sète · taille de barbe Sète · barbier Frontignan · rasage traditionnel Sète (+ Balaruc, Mèze, Marseillan, Bassin de Thau).

| Page | Title (≤ 60) | Requête principale |
|------|--------------|-------------------|
| / | Dégradé — Barbier à Sète, fade & barbe | barbier Sète |
| /coupes | Coupes homme à Sète : fade, taper, barbe | dégradé américain Sète |
| /equipe | Les barbiers de Dégradé, Sète | barbershop Sète |
| /reserver | Réserver chez votre barbier à Sète | coiffeur homme Sète |
| /infos | Horaires, accès et FAQ — barbier Sète | barbier Frontignan / Balaruc |

JSON-LD : `HairSalon` (openingHoursSpecification, geo, areaServed, priceRange, hasOfferCatalog), `Service` + `Offer` par prestation, `FAQPage`, `BreadcrumbList`. OG image générée (`next/og`) par page.

## 7. Direction artistique

- **Palette** : charbon `#111111` · crème `#F2EDE4` · acier `#9AA0A6` (+ acier foncé `#5C6167` pour texte sur crème, AA) · rouge enseigne `#C8102E` réservé aux actions et détails.
- **Typo** : Big Shoulders (axe `opsz` 72 = Display) titres très condensés, très grands · Schibsted Grotesk texte.
- **Graphisme** : traces de tondeuse (lignes fines 1 px, espacement serré), chiffres énormes (numéros de sabot), profils gravés en hachures, grain photo animé très léger.
- Grille 12 colonnes assumée, asymétrique ; ruptures d'échelle (titre 22 vw / légendes 12 px).
- Easings maison : `--ease-blade` (0.7, 0, 0.2, 1), `--ease-out-cut` (0.16, 1, 0.3, 1), `--ease-thud` (0.34, 1.56, 0.64, 1).
- Transition de page : coup de lame diagonal (View Transitions API, repli sans animation).

## 8. Ordre de construction (1 commit par étape)

1. Setup · 2. Design system · 3. Données + moteurs (heure, créneaux, tarifs) · 4. Layout (header, pastille, menu, CTA mobile, footer, loader, grain, Lenis) · 5. Sections accueil · 6. 3D rasoir + enseigne · 7. Coupes + configurateur · 8. Équipe · 9. Réservation + API · 10. Infos + FAQ + contact · 11. SEO (metadata, JSON-LD, OG, sitemap…) · 12. Légal + cookies · 13. Contrôle visuel 375 / 768 / 1440 / 1920 + polish · 14. README + ASSETS.
