import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Telechargement {
  _id: string;
  utilisateur: string;
  ressource: any;
  dateTelechargement: Date;
}
@Injectable({
  providedIn: 'root'
})
export class TelechargementService {
  private apiUrl = 'http://localhost:5000/api/telechargements';

  constructor(private http: HttpClient) { }

 enregistrerTelechargement(ressourceId: string): Observable<{ message: string; fichierUrl: string }> {
    const token = localStorage.getItem('token');
    console.log('Token trouvé dans localStorage:', token); // 🧩 Ajoute ceci pour debug

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // ✅ le format exact attendu par le backend
    });

    return this.http.post<{ message: string; fichierUrl: string }>(
      this.apiUrl,
      { ressourceId },
      { headers }
    );
  }

  getMonHistorique(): Observable<Telechargement[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Telechargement[]>(`${this.apiUrl}/mon-historique`, { headers });
  }
}

