/**
 * Photos de la galerie « Au fauteuil » — vraies photos, licence CC BY 2.0
 * (Flickr, via le jeu de données Open Images). L'attribution est OBLIGATOIRE :
 * elle est affichée sous la galerie et dans les mentions légales.
 * Modifications : recadrage à l'affichage, étalonnage chaud et compression.
 * Pour un vrai salon : remplacer par ses propres photos (même nom de fichier).
 */
export interface PhotoGalerie {
  src: string;
  alt: string;
  legende: string;
  /** Cadrage dans la tuile (object-position) */
  cadrage: string;
  auteur: string;
  source: string;
}

export const LICENCE = { nom: "CC BY 2.0", url: "https://creativecommons.org/licenses/by/2.0/deed.fr" } as const;

export const photos: PhotoGalerie[] = [
  {
    src: "/images/galerie/rasage-coupe-chou.jpg",
    alt: "Barbier tatoué qui rase un client au coupe-chou, mousse sur la joue, tête renversée",
    legende: "Rasage au coupe-chou",
    cadrage: "50% 40%",
    auteur: "John Patrick Robichaud",
    source: "https://www.flickr.com/photos/troismarteaux/16702534327",
  },
  {
    src: "/images/galerie/salon-vintage.jpg",
    alt: "Barbier au travail derrière un client, fauteuils chromés et étagères de flacons",
    legende: "Fauteuils d'époque",
    cadrage: "50% 55%",
    auteur: "Meagan Fisher",
    source: "https://www.flickr.com/photos/meaganfisher/7496351192",
  },
  {
    src: "/images/galerie/tondeuse-sourire.jpg",
    alt: "Barbier souriant qui passe la tondeuse sur la nuque d'un jeune client",
    legende: "La tondeuse, et le sourire",
    cadrage: "72% 40%",
    auteur: "LiteTouch Photography",
    source: "https://www.flickr.com/photos/g_link/2882187790",
  },
  {
    src: "/images/galerie/ciseaux-peigne.jpg",
    alt: "Vieux barbier en chemise à carreaux, peigne et ciseaux au-dessus de la tête d'un client",
    legende: "Ciseaux et peigne",
    cadrage: "62% 30%",
    auteur: "Jason White",
    source: "https://www.flickr.com/photos/jasonwhite/8288802599",
  },
  {
    src: "/images/galerie/contours-peigne.jpg",
    alt: "Gros plan : un peigne et une main qui placent la mèche d'un client",
    legende: "Le dessus, au peigne",
    cadrage: "40% 50%",
    auteur: "OXLAEY.com",
    source: "https://www.flickr.com/photos/oxlaey/20092078730",
  },
  {
    src: "/images/galerie/serviette-chaude.jpg",
    alt: "Photo noir et blanc : client renversé dans le fauteuil, visage couvert de mousse, barbier penché sur lui",
    legende: "Serviette chaude",
    cadrage: "55% 30%",
    auteur: "piotr mamnaimie",
    source: "https://www.flickr.com/photos/mamnaimie/6273361040",
  },
  {
    src: "/images/galerie/coupe-atelier.jpg",
    alt: "Barbier qui rit en finissant la coupe d'un client barbu, mur de briques et grande fenêtre",
    legende: "Entre deux blagues",
    cadrage: "62% 45%",
    auteur: "Jason Scott",
    source: "https://www.flickr.com/photos/textfiles/8465434157",
  },
];
