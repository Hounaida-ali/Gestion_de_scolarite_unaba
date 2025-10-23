import { Departement } from './departementInterface';
import { Programme } from './ProgramInterface';

export interface Formation {
  _id: string;
  nom: string;
  description: string;
  icone?: string;
  duree: string;
  niveau: 'license';
  code: string;
  cours: { nom: string; code: string }[];
  departement?: string | Departement;
  programmes: Programme[];
  createdAt?: string;
  updatedAt?: string;
}