import { User } from './userInterface';

export interface Evaluation {
  _id?: string;
  etudiant: { id: string; nom: string };
  enseignant: { id: string; nom: string };
  matiere: string;
  departement: string;
  filiere?: string;
  niveau?: string;
  typeEvaluation: 'controle' | 'td' | 'tp';
  note: number;
  commentaire?: string;
  dateCreation: string;
}
