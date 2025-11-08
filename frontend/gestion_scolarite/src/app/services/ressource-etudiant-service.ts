import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ressourcesInterface } from '../interfaces/ressourceInterface'; // ✅ CORRECTION ICI

export interface RessourceResponse {
  ressources: ressourcesInterface[];
  totalPages: number;
  currentPage: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class RessourceEtudiantService {
  private apiUrl = 'http://localhost:5000/api/ressources';

  constructor(private http: HttpClient) {}

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

    if (type?.trim()) params = params.set('type', type);
    if (niveau?.trim()) params = params.set('niveau', niveau);
    if (matiere?.trim()) params = params.set('matiere', matiere);
    if (search?.trim()) params = params.set('search', search);

    console.log('Params envoyés à l’API:', params.toString());
    return this.http.get<RessourceResponse>(this.apiUrl, { params });
  }

  getRessource(id: string): Observable<ressourcesInterface> {
    return this.http.get<ressourcesInterface>(`${this.apiUrl}/${id}`);
  }

  createRessource(formData: FormData): Observable<ressourcesInterface> {
    return this.http.post<ressourcesInterface>(this.apiUrl, formData);
  }

  updateRessource(id: string, ressource: Partial<ressourcesInterface>): Observable<ressourcesInterface> {
    return this.http.put<ressourcesInterface>(`${this.apiUrl}/${id}`, ressource);
  }

  deleteRessource(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
