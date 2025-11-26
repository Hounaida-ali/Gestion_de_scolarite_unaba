import { Departement } from '../components/departement/departement';
import { Niveau } from './niveauInterface';

export interface Programme {
  _id?: string;
  departement: string  // eco, gestion, droit
  code: string; // sciences-eco, monetaire-bancaire, admin-gestion, droit-affaires
  nom: string;
  description: string;
  duree: string;
  credits: string;
  diplome: string;
  acces: string;
  niveaux: Niveau[];
  createdAt?: Date;
  updatedAt?: Date;
}