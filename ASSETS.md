# ASSETS — visuels, sources et crédits

La direction artistique repose d'abord sur des visuels **procéduraux, SVG et typographiques**, dessinés pour ce site : ils ne se retrouvent nulle part ailleurs.
Le téléchargement de photos libres (Unsplash, Pexels, Wikimedia) est bloqué dans l'environnement de production du site : le salon et la devanture sont donc **dessinés** (SVG en aplats arrondis). Pour un vrai client, de vraies photos restent préférables (prompts ci-dessous).

## 1. Visuels originaux (code, aucun crédit tiers)

| Visuel | Fichier | Technique |
|---|---|---|
| Tondeuse 3D (section « Les coupes ») | `src/components/three/TondeuseScene.tsx` | Corps en `LatheGeometry` laqué, bague et interrupteur or, lames chromées et dents en `InstancedMesh`, sabot à côtes extrudées, gravure en texture canvas, reflets Lightformer — aucun modèle ni HDR téléchargé |
| Enseigne de barbier 3D (progression) | `src/components/three/EnseigneScene.tsx` | Cylindre + shader GLSL maison (spirale pilotée par le scroll) |
| Intérieur du salon, le soir (fauteuils, miroirs en arche cerclés d'or, Sabot le chat) | `src/components/illustrations/IllustrationSalon.tsx` | SVG dessiné, aplats arrondis |
| Devanture Grand'Rue, le soir (store festonné or, vitrine éclairée, vélo) | `src/components/illustrations/IllustrationDevanture.tsx` | SVG dessiné, aplats arrondis |
| Tondeuse SVG (premier affichage, repli sans WebGL) | `src/components/illustrations/TondeuseSVG.tsx` | SVG dessiné à la main |
| Profils gravés (coupes, configurateur, avant/après, portraits) | `src/components/illustrations/profil-*.ts(x)` | SVG paramétrique : hachures « traces de tondeuse », masque de fondu, morphing |
| Carte de Sète | `src/components/illustrations/CarteSete.tsx` | SVG stylisé (étang de Thau, canal royal, Mont Saint-Clair en courbes de niveau) — pas de carte tierce |
| Pictos | `src/components/ui/Icons.tsx` | SVG maison, trait 1,5 px |
| Tampons de fidélité | `src/components/home/Fidelite.tsx` | SVG |
| Favicons / icônes PWA | `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `public/icons/*` | `scripts/icons.mjs` |
| Images Open Graph (1 par page) | `src/app/**/opengraph-image.tsx` | `next/og`, générées au build |

## 1 bis. Photo

| Visuel | Fichier | Origine |
|---|---|---|
| Salon (hero, page L'équipe, images Open Graph) | `public/images/salon-hero.jpg` (1200 × 1500) | Image fournie par le client pour la démo, éclaircie (+14 %) et recompressée avec `sharp`. **Vérifier les droits d'usage** avant toute mise en ligne publique ; pour un vrai salon, la remplacer par une photo du lieu en gardant le même nom (cadrage : fauteuils au centre, zone sombre en haut pour le texte sur mobile). |

### Galerie « Au fauteuil » (accueil, page L'équipe) — vraies photos, **CC BY 2.0**

Photos Flickr trouvées via le jeu de données **Open Images** (Google), toutes sous licence [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/deed.fr) : réutilisation libre, **attribution obligatoire** (faite sous la galerie et dans les mentions légales). Modifications : étalonnage chaud commun (saturation −15 %, légère dominante chaude), recadrage à l'affichage, compression. Données et crédits : `src/data/galerie.ts`.

| Fichier (`public/images/galerie/`) | Légende | Auteur | Source |
|---|---|---|---|
| `rasage-coupe-chou.jpg` | Rasage au coupe-chou | John Patrick Robichaud | https://www.flickr.com/photos/troismarteaux/16702534327 |
| `salon-vintage.jpg` | Fauteuils d'époque | Meagan Fisher | https://www.flickr.com/photos/meaganfisher/7496351192 |
| `tondeuse-sourire.jpg` | La tondeuse, et le sourire | LiteTouch Photography | https://www.flickr.com/photos/g_link/2882187790 |
| `ciseaux-peigne.jpg` | Ciseaux et peigne | Jason White | https://www.flickr.com/photos/jasonwhite/8288802599 |
| `contours-peigne.jpg` | Le dessus, au peigne | OXLAEY.com | https://www.flickr.com/photos/oxlaey/20092078730 |
| `serviette-chaude.jpg` | Serviette chaude | piotr mamnaimie | https://www.flickr.com/photos/mamnaimie/6273361040 |
| `coupe-atelier.jpg` | Entre deux blagues | Jason Scott | https://www.flickr.com/photos/textfiles/8465434157 |

Ces personnes sont réelles : elles ne sont **jamais** présentées comme l'équipe de Dégradé (pas de prénom, pas de citation). Les fiches des barbiers restent des portraits gravés tant que le salon ne fournit pas ses propres photos. Pour un vrai client, remplacer la galerie par des photos du salon (avec l'accord écrit des personnes visibles, droit à l'image).

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
