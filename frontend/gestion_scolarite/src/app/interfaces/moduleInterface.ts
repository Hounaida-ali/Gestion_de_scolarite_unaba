import { Cours } from './CourseInterface';

export interface Module {
  _id?: string;
  nom: string;
  cours: Cours[];
  createdAt?: Date;
  updatedAt?: Date;
}