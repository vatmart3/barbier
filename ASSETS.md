# ASSETS — visuels, sources et crédits

La direction artistique repose d'abord sur des visuels **procéduraux, SVG et typographiques**, dessinés pour ce site : ils ne se retrouvent nulle part ailleurs.
Le téléchargement de photos libres (Unsplash, Pexels, Wikimedia) est bloqué dans l'environnement de production du site : le salon et la devanture sont donc **dessinés** (SVG en aplats arrondis). Pour un vrai client, de vraies photos restent préférables (prompts ci-dessous).

## 1. Visuels originaux (code, aucun crédit tiers)

| Visuel | Fichier | Technique |
|---|---|---|
| Profils gravés (configurateur de coupe) | `src/components/illustrations/profil-*.ts(x)` | SVG paramétrique : hachures « traces de tondeuse », masque de fondu, morphing |
| Carte de Sète | `src/components/illustrations/CarteSete.tsx` | SVG stylisé (étang de Thau, canal royal, Mont Saint-Clair en courbes de niveau) — pas de carte tierce |
| Pictos | `src/components/ui/Icons.tsx` | SVG maison, trait 1,5 px |
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
`next/image` produit automatiquement AVIF/WebP.

### Salon et galerie
Remplacer `public/images/salon-hero.jpg` et les photos de `public/images/galerie/` par celles du salon, en gardant les noms (et mettre à jour `src/data/galerie.ts` : légendes, alt, crédits).

### Portraits des barbiers (facultatif) — 1200 × 1500 px (ratio 4:5)
Les fiches des barbiers sont aujourd'hui typographiques (monogramme). Pour de vraies photos, prévoir : noir et blanc, plan taille, outil en main (coupe-chou, ciseaux, tondeuse), lumière latérale.

## 4. Textes

Tous les textes sont originaux. Les **avis** (`src/data/avis.ts`), le **mot du patron** (`src/components/home/MotDuPatron.tsx`) et les profils des barbiers (`src/data/barbiers.ts`) sont **fictifs** : à réécrire avec le vrai salon, idéalement avec ses propres mots.
