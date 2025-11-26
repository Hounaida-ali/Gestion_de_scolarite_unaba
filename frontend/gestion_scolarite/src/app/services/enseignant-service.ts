import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Enseignant, CreationEnseignantResponse } from '../interfaces/enseignantInterface';
import { Cours } from '../components/profil-enseignent/profil-enseignent';

@Injectable({
  providedIn: 'root',
})
export class EnseignantService {
  private apiUrl = 'http://localhost:5000/api/enseignants';
  private currentEnseignantSubject = new BehaviorSubject<Enseignant | null>(null);
  currentEnseignant$ = this.currentEnseignantSubject.asObservable();

  constructor(private http: HttpClient) {}

  getEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl);
  }

  getEnseignantById(id: string): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }
getDepartements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departements`);
  }

  createEnseignant(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.apiUrl, enseignant);
  }

  updateEnseignant(id: string, enseignant: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, enseignant);
  }

  deleteEnseignant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // 🔹 Enseignant connecté
  getCurrentEnseignant(): Observable<Enseignant> {
  const token = localStorage.getItem('token');
  console.log(token);
  
  return this.http.get<Enseignant>(`${this.apiUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}



  setCurrentEnseignant(enseignant: Enseignant) {
    this.currentEnseignantSubject.next(enseignant);
  }

  // 🔹 Emploi du temps de l’enseignant
  getEmploiDuTemps(enseignantId: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/${enseignantId}/emploi`);
  }

  // 🔹 Cours assignés à l’enseignant
  getCoursAssignes(enseignantId: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/${enseignantId}/cours`);
  }

  // 🔹 Statistiques de l’enseignant
  getStatsEnseignant(enseignantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${enseignantId}/stats`);
  }
}
