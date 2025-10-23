import { Module } from './moduleInterface';

export interface UE {
  _id?: string;
  nom: string;
  modules: Module[];
  totalCredits: number;
  createdAt?: Date;
  updatedAt?: Date;
}