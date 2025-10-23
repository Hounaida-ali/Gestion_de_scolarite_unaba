import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ressource } from '../interfaces/ressourceInterface';
import { HttpParams } from '@angular/common/http';


export interface RessourceResponse {
  ressources: Ressource[];
  totalPages: number;
  currentPage: number;
  total: number;
}
@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private apiUrl = 'http://localhost:5000/api/ressources';
  constructor(private http: HttpClient) { }

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

    if (type && type.trim() !== '') params = params.set('type', type);
    if (niveau && niveau.trim() !== '') params = params.set('niveau', niveau);
    if (matiere && matiere.trim() !== '') params = params.set('matiere', matiere);
    if (search && search.trim() !== '') params = params.set('search', search);
    console.log('Params envoyés à l’API:', params.toString());
    return this.http.get<RessourceResponse>(this.apiUrl, { params });
  }


  getRessource(id: string): Observable<Ressource> {
    return this.http.get<Ressource>(`${this.apiUrl}/${id}`);
  }

  createRessource(formData: FormData): Observable<Ressource> {
    return this.http.post<Ressource>(this.apiUrl, formData);
  }

  updateRessource(id: string, ressource: Partial<Ressource>): Observable<Ressource> {
    return this.http.put<Ressource>(`${this.apiUrl}/${id}`, ressource);
  }

  deleteRessource(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
