export interface Enseignant {
  _id?: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  specialite: string;
  grade: string;
  departement: string;
  dateEmbauche: string;
  statut: 'actif' | 'inactif' | 'congé' | 'retraité';
  coursAffectes?: any[];
  dateCreation?: string;
}

export interface CreationEnseignantResponse {
  message: string;
  enseignant: Enseignant;
}