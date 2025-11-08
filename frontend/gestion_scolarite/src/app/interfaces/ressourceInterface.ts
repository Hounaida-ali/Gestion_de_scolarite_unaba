export interface ressourcesInterface {
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
  dateCreation: Date | string;       // ajouté
  datePublication?: Date | string;
  tags: string[];
  estPublic: boolean;
}
