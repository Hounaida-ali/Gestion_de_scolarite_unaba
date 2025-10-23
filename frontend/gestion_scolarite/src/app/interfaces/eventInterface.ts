export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  type: 'cours' | 'examen' | 'vacances' | 'ferie' | 'autre';
  period: string;
  academicYear: string;
  semester: 1 | 2;
  createdAt?: Date;
  updatedAt?: Date;
}