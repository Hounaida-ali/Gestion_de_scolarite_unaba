import { Formation } from "./formationInterface";

export interface DepartementAvecFormations {
  _id: string; // identifiant du département
  nom: string;
  description: string;
  couleur?: string;
  icone?: string;
  formations: Formation[]; // liste des formations de ce département
}