import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface News {
  _id?: string;        // optionnel pour les nouvelles créées
  titre: string;
  contenu: string;
  date: Date | string;
  actionText: string;
}
@Injectable({
  providedIn: 'root'
})
export class AllNewsService {
  private apiUrl = 'http://localhost:5000/api/AllNews'; // URL de ton backend AllNews

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les actualités
  getAllNews(): Observable<News[]> {
    return this.http.get<{ success: boolean; data: News[]; count: number }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // ✅ Récupérer une actualité par ID
  getNewsById(id: string): Observable<News> {
    return this.http.get<{ success: boolean; data: News }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // ✅ Créer une nouvelle actualité
  createNews(news: News): Observable<News> {
    return this.http.post<{ success: boolean; data: News }>(this.apiUrl, news)
      .pipe(map(response => response.data));
  }

  // ✅ Mettre à jour une actualité
  updateNews(id: string, news: News): Observable<News> {
    return this.http.put<{ success: boolean; data: News }>(`${this.apiUrl}/${id}`, news)
      .pipe(map(response => response.data));
  }

  // ✅ Supprimer une actualité
  deleteNews(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

