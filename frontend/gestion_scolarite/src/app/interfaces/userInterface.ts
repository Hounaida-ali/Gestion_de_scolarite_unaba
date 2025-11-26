export interface User {
  _id?: string;              // l’ObjectId côté backend
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  isEmailVerified: boolean;
}
