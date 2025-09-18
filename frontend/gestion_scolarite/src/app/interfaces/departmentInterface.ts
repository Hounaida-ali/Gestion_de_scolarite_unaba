export interface Department {
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: any;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}