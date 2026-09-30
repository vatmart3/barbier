# ASSETS — visuels, sources et crédits

La direction artistique repose d'abord sur des visuels **procéduraux, SVG et typographiques**, dessinés pour ce site : ils ne se retrouvent nulle part ailleurs.
Le téléchargement de photos libres (Unsplash, Pexels, Wikimedia) est bloqué dans l'environnement de production du site : le salon et la devanture sont donc **dessinés** (SVG en aplats arrondis). Pour un vrai client, de vraies photos restent préférables (prompts ci-dessous).

## 1. Visuels originaux (code, aucun crédit tiers)

| Visuel | Fichier | Technique |
|---|---|---|
| Rasoir coupe-chou 3D (hero) | `src/components/three/RasoirScene.tsx` | Géométries extrudées procédurales, acier `MeshPhysicalMaterial`, corne en texture canvas, reflets Lightformer — aucun modèle ni HDR téléchargé |
| Enseigne de barbier 3D (progression) | `src/components/three/EnseigneScene.tsx` | Cylindre + shader GLSL maison (spirale pilotée par le scroll) |
| Intérieur du salon, le soir (fauteuils, miroirs en arche cerclés d'or, Sabot le chat) | `src/components/illustrations/IllustrationSalon.tsx` | SVG dessiné, aplats arrondis |
| Devanture Grand'Rue, le soir (store festonné or, vitrine éclairée, vélo) | `src/components/illustrations/IllustrationDevanture.tsx` | SVG dessiné, aplats arrondis |
| Rasoir SVG (repli sans WebGL) | `src/components/illustrations/RasoirSVG.tsx` | SVG dessiné à la main |
| Profils gravés (coupes, configurateur, avant/après, portraits) | `src/components/illustrations/profil-*.ts(x)` | SVG paramétrique : hachures « traces de tondeuse », masque de fondu, morphing |
| Carte de Sète | `src/components/illustrations/CarteSete.tsx` | SVG stylisé (étang de Thau, canal royal, Mont Saint-Clair en courbes de niveau) — pas de carte tierce |
| Pictos | `src/components/ui/Icons.tsx` | SVG maison, trait 1,5 px |
| Tampons de fidélité | `src/components/home/Fidelite.tsx` | SVG |
| Favicons / icônes PWA | `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `public/icons/*` | `scripts/icons.mjs` |
| Images Open Graph (1 par page) | `src/app/**/opengraph-image.tsx` | `next/og`, générées au build |

## 2. Polices

Toutes sous **SIL Open Font License 1.1** (fichiers et licence dans `src/assets/fonts/`, sinon servies par `next/font/google`, auto-hébergées au build) :

| Police | Rôle | Chargement |
|---|---|---|
| **Fraunces** (Undercase Type), axe « SOFT » à 100 | Titres, prix : empattements arrondis, chaleureux | Instance locale en graisse fine (420), tailles optiques 24–144 (`Fraunces-Soft.woff2`, 33 Ko, préchargée). Générée avec `fonttools varLib.instancer` depuis Google Fonts |
| **Figtree** (Erik Kennedy) | Texte courant, interface | `next/font/google`, préchargée (20 Ko) |
| **Caveat** (Impallari Type) | Notes à la main : répliques des barbiers, signature de Karim | `next/font/google`, non préchargée (jamais critique) |

Les images Open Graph utilisent `Fraunces-Soft.ttf` et `Figtree-Medium.ttf`.

## 3. Photos à prévoir pour un vrai client

Style commun : **noir et blanc, fort contraste, grain argentique léger**, lumière latérale dure, aucun visage reconnaissable sans autorisation écrite (droit à l'image), aucune marque visible.
Déposer la photo dans `public/images/` et remplacer l'illustration par un `next/image` du même ratio ; AVIF/WebP sont produits automatiquement.

### Salon — 1600 × 1100 px (ratio 16:11)
À la place de : `IllustrationSalon` (page L'équipe, section « La maison » ; accueil, « Le mot de la maison »).
Alt proposé : « Les trois fauteuils de barbier de Dégradé face aux miroirs, salon Grand'Rue à Sète ».

> Prompt : *Black and white high-contrast photograph of a small barbershop interior in a southern French town, three vintage 1960s hydraulic barber chairs in dark leather and chrome facing three rectangular mirrors, checkerboard tiled floor, hard side light from a large shop window on the right, deep blacks, film grain, shot at eye level with a 35mm lens, editorial magazine style, no people, no text, no logos — 1600×1100.*

### Devanture — 1600 × 1000 px (ratio 8:5)
À la place de : `IllustrationDevanture` (page Infos & accès, sous le plan).
Alt proposé : « Devanture noire du barbier Dégradé avec son enseigne et son poteau de barbier, Grand'Rue Mario Roustan à Sète ».

> Prompt : *Black and white street photograph of a narrow barbershop storefront in Sète, France, matte black painted facade with large shop window, cream uppercase condensed sign lettering reading "DÉGRADÉ", classic barber pole mounted on the left, pale limestone wall, late afternoon Mediterranean light with strong shadows, film grain, frontal composition, no people — 1600×1000.*

### Avant / après (facultatif) — 4 paires, 1200 × 1000 px (ratio 6:5)
Renseigner `photos` dans `src/data/realisations.ts` (`/images/<id>-avant.jpg`, `/images/<id>-apres.jpg`). Toujours le même cadrage (profil gauche ou nuque), même lumière, fond neutre.

> Prompt type : *Black and white close-up profile photograph of a man's head [before: overgrown hair and untrimmed beard / after: crisp high skin fade with textured top and sharp beard line], seamless mid-grey backdrop, hard side light, high contrast, film grain, barbershop portfolio style, face turned away or cropped at the eyes — 1200×1000.*

### Portraits des barbiers (facultatif) — 1200 × 1500 px (ratio 4:5)
Les portraits sont aujourd'hui des profils gravés (`portrait` dans `src/data/barbiers.ts`). Pour de vraies photos, prévoir : noir et blanc, plan taille, outil en main (coupe-chou, ciseaux, tondeuse), lumière latérale.

## 4. Textes

Tous les textes sont originaux. Les **avis** (`src/data/avis.ts`), le **mot du patron** (`src/components/home/MotDuPatron.tsx`) et les profils des barbiers (`src/data/barbiers.ts`) sont **fictifs** : à réécrire avec le vrai salon, idéalement avec ses propres mots.
