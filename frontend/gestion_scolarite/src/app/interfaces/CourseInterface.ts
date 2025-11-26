export interface Cours {
  _id?: string;
  nom: string;
  code: string;
  coefficient: number;
  credits: number;
  cm: number;
  td: number;
  totalHeures: number;
  niveau: 'L1' | 'L2' | 'L3';
  createdAt?: Date;
  updatedAt?: Date;
}
