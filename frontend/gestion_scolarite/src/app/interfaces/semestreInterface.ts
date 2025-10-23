import { UE } from './ueInterface';

export interface Semestre {
  _id?: string;
  numero: number;
  nom: string;
  ues: UE[];
  createdAt?: Date;
  updatedAt?: Date;
}