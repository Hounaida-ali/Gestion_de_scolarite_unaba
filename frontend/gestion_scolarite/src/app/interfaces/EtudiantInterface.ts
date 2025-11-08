export interface Etudiant {
  _id?: string;
  idProvisoire?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  adresse: string;
  ville: string;
  codePostal: string;
  niveauEtudes: string;
  departement:'économie'| 'droit'| 'gestion';
  formation: string;
  modeFormation: 'presentiel' | 'en-ligne';
  documents?: string[];
  photoEtudiant?: string; // Nouveau champ pour la photo
  statut?: 'en-attente' | 'valide' | 'rejete' | 'paye' | 'confirme';
  fraisInscription?: number;
  dateInscription?: string;
  numeroEtudiant?: string;

   photo?: {
    filename: string;
    originalName: string;
    path: string;
    url: string;
    uploadDate: string;
  };
}

// Interface pour la réponse de création
export interface CreationEtudiantResponse {
  message: string;
  etudiant: Etudiant;
}
