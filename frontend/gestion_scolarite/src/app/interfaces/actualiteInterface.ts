export interface News {
  _id?: string;
  titre: string;
  contenu: string;
  date: string;
  actionText: string;
  sousTitre?: string;
  modalDescription?: string;
  details?: string[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
