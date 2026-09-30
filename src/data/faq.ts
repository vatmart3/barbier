/** Questions fréquentes (page Infos + JSON-LD FAQPage). */
export interface QuestionFaq {
  q: string;
  r: string;
}

export const faq: QuestionFaq[] = [
  {
    q: "Faut-il réserver, ou vous prenez sans rendez-vous ?",
    r: "Les deux. La réservation garantit l'heure. Sans rendez-vous, passez voir : s'il y a un trou dans le planning, on vous prend. Le samedi, réservez.",
  },
  {
    q: "Combien de temps tient un dégradé ?",
    r: "Un skin fade est net 10 à 14 jours, un fade bas ou moyen environ 3 semaines, un taper 4 semaines. Entre deux coupes, un passage « contours » à 8 € rallonge d'une semaine.",
  },
  {
    q: "Quelle différence entre un fade et un taper ?",
    r: "Le fade (dégradé) fond les côtés et l'arrière sur toute la hauteur choisie : bas, moyen ou haut. Le taper ne touche que les pattes et la nuque. Plus discret, il repousse mieux.",
  },
  {
    q: "Vous coupez les cheveux bouclés, frisés, crépus ?",
    r: "Oui, tous types de cheveux. Théo est notre référent boucles : coupe à sec, ciseaux sur peigne, sans passer la tondeuse partout par défaut.",
  },
  {
    q: "Le rasage à l'ancienne, ça se passe comment ?",
    r: "Serviette chaude pour ouvrir le poil, mousse au blaireau, deux passages au coupe-chou (dans le sens du poil puis en travers), serviette froide et baume. Compter 30 minutes. Lame neuve à chaque client.",
  },
  {
    q: "Je viens de Frontignan, Balaruc ou Mèze : où se garer ?",
    r: "Parking des Halles à 150 m, première demi-heure offerte. Depuis Frontignan comptez 15 minutes, 12 depuis Balaruc-les-Bains, 22 depuis Mèze. Le jeudi, la nocturne jusqu'à 21 h évite les bouchons du pont.",
  },
  {
    q: "Et si je suis en retard ou que je dois annuler ?",
    r: "Annulation gratuite jusqu'à 2 heures avant, par téléphone ou par e-mail. Au-delà de 10 minutes de retard, on adapte la prestation ou on décale, selon le planning.",
  },
  {
    q: "Vous prenez les enfants ?",
    r: "À partir de 6 ans, en semaine. Coupe moins de 16 ans à 18 €. Le mercredi après-midi part vite, réservez.",
  },
  {
    q: "Quels moyens de paiement ?",
    r: "Carte bancaire, sans contact et espèces. Pas de chèque. Les bons cadeaux sont en vente au salon.",
  },
];
