import { Semestre } from './semestreInterface';

export interface Niveau {
  _id?: string;
  code: 'L1' | 'L2' | 'L3';
  nom: string;
  description: string;
  semestres: Semestre[];
  createdAt?: Date;
  updatedAt?: Date;
}