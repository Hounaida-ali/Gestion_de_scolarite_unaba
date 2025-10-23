import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { News } from '../interfaces/actualiteInterface';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
  private apiUrl = 'http://localhost:5000/api/actualites'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les actualités
  getActualites(): Observable<News[]> {
    return this.http.get<{ success: boolean; data: News[]; count: number }>(this.apiUrl)
      .pipe(map(response => response.data)); // 👉 Extraire "data"
  }

  // ✅ Récupérer une actualité par ID
  getActualiteById(id: string): Observable<News> {
    return this.http.get<{ success: boolean; data: News }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // ✅ Créer une actualité
  createActualite(actualite: News): Observable<News> {
    return this.http.post<{ success: boolean; data: News }>(this.apiUrl, actualite)
      .pipe(map(response => response.data));
  }

  // ✅ Mettre à jour une actualité
  updateActualite(id: string, actualite: News): Observable<News> {
    return this.http.put<{ success: boolean; data: News }>(`${this.apiUrl}/${id}`, actualite)
      .pipe(map(response => response.data));
  }

  // ✅ Supprimer une actualité
  deleteActualite(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
