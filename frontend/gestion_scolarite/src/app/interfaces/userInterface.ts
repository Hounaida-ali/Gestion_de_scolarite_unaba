export interface User {
  _id?: string;              // l’ObjectId côté backend
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
}
