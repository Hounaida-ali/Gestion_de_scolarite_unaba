export interface Ressource {
  _id?: string;
  titre: string;
  description: string;
  type: string;
  niveau: string;
  matiere: string;
  fichier: {
    nom: string;
    url: string;
    taille: number;
    type: string;
  };
  auteur: {
    _id: string;
    nom: string;
    prenom: string;
  };
  datePublication: Date;
  tags: string[];
  estPublic: boolean;
}