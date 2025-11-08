import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface AccesRapide {
  _id?: string;
  titre: string;
  contenu: string;
  icon:string;
  actionText: string;
  sousTitre?: string;
  modalDescription?: string;
  details?: string[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
@Injectable({
  providedIn: 'root'
})
export class QuickAccesAdminService {
  private apiUrl = 'http://localhost:5000/api/Quickaccess';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les accès rapides
  getAccesRapides(): Observable<AccesRapide[]> {
    return this.http.get<{ success: boolean; data: AccesRapide[]; count: number }>(this.apiUrl)
      .pipe(map(response => response.data)); 
  }

  // ✅ Récupérer un accès rapide par ID
  getAccesRapideById(id: string): Observable<AccesRapide> {
    return this.http.get<{ success: boolean; data: AccesRapide }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // ✅ Créer un accès rapide
  createAccesRapide(accesRapide: AccesRapide): Observable<AccesRapide> {
    return this.http.post<{ success: boolean; data: AccesRapide }>(this.apiUrl, accesRapide)
      .pipe(map(response => response.data));
  }

  // ✅ Mettre à jour un accès rapide
  updateAccesRapide(id: string, accesRapide: AccesRapide): Observable<AccesRapide> {
    return this.http.put<{ success: boolean; data: AccesRapide }>(`${this.apiUrl}/${id}`, accesRapide)
      .pipe(map(response => response.data));
  }

  // ✅ Supprimer un accès rapide
  deleteAccesRapide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
