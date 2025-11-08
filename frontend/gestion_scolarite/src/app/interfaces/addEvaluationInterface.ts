// Pour l'ajout d'une évaluation côté frontend
export interface AddEvaluationPayload {
  etudiant: string;        // Nom complet, ex: "John Doe"
  enseignant: string;      // Nom complet, ex: "Jane Smith"
  matiere: string;
  departement: string;
  filiere?: string;
  niveau?: string;
  typeEvaluation: 'controle' | 'td' | 'tp';
  note: number;
  commentaire?: string;
}
