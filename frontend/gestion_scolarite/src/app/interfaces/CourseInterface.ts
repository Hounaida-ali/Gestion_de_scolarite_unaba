export interface Cours {
  _id?: string;
  nom: string;
  code: string;
  coefficient: number;
  credits: number;
  cm: number;
  td: number;
  totalHeures: number;
  createdAt?: Date;
  updatedAt?: Date;
}