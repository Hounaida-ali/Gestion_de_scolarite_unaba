export interface UploadedFile {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  uploadDate?: string;
  taille?: number;
  type?: string;
}

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
  departement: string;
  formation: string;
  niveau?: string;
  modeFormation: 'presentiel' | 'en-ligne';
  
  // Documents multiples
  documents?: UploadedFile[];
  
  // Photo étudiant
  photoEtudiant?: string; // URL directe de la photo
  photo?: UploadedFile;   // Détails complets du fichier
  
  statut?: 'en-attente' | 'valide' | 'rejete' | 'paye' | 'confirme' | 'PXE';
  fraisInscription?: number;
  dateInscription?: string;
  numeroEtudiant?: string;
}

// Interface pour la réponse de création
export interface CreationEtudiantResponse {
  message: string;
  etudiant: Etudiant;
}
