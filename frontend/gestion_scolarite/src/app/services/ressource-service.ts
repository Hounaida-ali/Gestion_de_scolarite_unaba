import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ressourcesInterface } from '../interfaces/ressourceInterface';

// 🔹 Interface pour la réponse de la liste des ressources
export interface RessourceResponse {
  ressources: ressourcesInterface[];
  totalPages: number;
  currentPage: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private apiUrl = 'http://localhost:5000/api/ressources';

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer la liste des ressources avec filtres + pagination
  getRessources(
    type?: string,
    niveau?: string,
    matiere?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Observable<RessourceResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (type) params = params.set('type', type);
    if (niveau) params = params.set('niveau', niveau);
    if (matiere) params = params.set('matiere', matiere);
    if (search) params = params.set('search', search);

    return this.http.get<RessourceResponse>(this.apiUrl, { params });
  }

  // 🔹 Récupérer une seule ressource par ID
  getRessource(id: string): Observable<ressourcesInterface> {
    return this.http.get<ressourcesInterface>(`${this.apiUrl}/${id}`);
  }

  // ✅ Fonction utilitaire pour générer les headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 🔹 Créer une nouvelle ressource (avec FormData)
  createRessource(formData: FormData): Observable<ressourcesInterface> {
    console.log('✅ [DEBUG] FormData envoyé au backend :');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.post<ressourcesInterface>(this.apiUrl, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔹 Créer une ressource à partir d'un objet JSON (fichier déjà uploadé)
  createRessourceJSON(payload: any): Observable<ressourcesInterface> {
    console.log('✅ [DEBUG] Payload JSON envoyé au backend :', payload);
    return this.http.post<ressourcesInterface>(this.apiUrl, payload, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔹 Upload fichier seul
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    console.log('✅ [DEBUG] Upload fichier :', file.name);
    return this.http.post('/api/file-uploads', formData);
  }

  // 🔹 Mettre à jour une ressource (avec ou sans fichier)
  updateRessource(id: string, formData: FormData): Observable<ressourcesInterface> {
    console.log('✅ [DEBUG] FormData envoyé pour update :');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.put<ressourcesInterface>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔹 Mise à jour d'une ressource avec JSON (sans fichier)
  updateRessourceJSON(id: string, payload: any): Observable<ressourcesInterface> {
    console.log('✅ [DEBUG] Payload JSON envoyé pour update :', payload);

    return this.http.put<ressourcesInterface>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getAuthHeaders()
    });
  }
  // 🔹 Supprimer une ressource
  deleteRessource(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
