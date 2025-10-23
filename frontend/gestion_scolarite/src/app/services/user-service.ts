import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from "../interfaces/userInterface";

export interface AuthResponse {
  message: string;
  otpToken: string;
  token: string,
  user: User
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

  }
  // 🔹 Connexion
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.router.navigate(['/']);
        })
      );
  }
  // 🔹 Inscription
  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.otpToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.router.navigate(['/verifyemail']);
        })
      );
  }
  // 🔹 Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  // 🔹 Demande de réinitialisation (envoi OTP)
  reinisilize(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reinisilize`, { email })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.otpToken);
          this.router.navigate(['/resetpassword']);
        })
      );
  }

  // 🔹 Réinitialisation du mot de passe avec OTP
  resetPassword(otp: number, otpToken: string, newPassword: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/resetpassword`, {
      otp,
      otpToken,
      purpose: 'reset-password',
      newPassword
    });
  }

  // 🔹 Vérification email après inscription
  verifyEmail(data: { otp: number; otpToken: string; purpose: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/verify-email`, data);
  }

  updateProfile(updatedData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update-profile`, updatedData)
      .pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  
}



