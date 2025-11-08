import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreationEtudiantResponse, Etudiant } from '../interfaces/EtudiantInterface';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  private apiUrl = 'http://localhost:5000/api/etudiants';
  private uploadUrl = 'http://localhost:5000/api/etudiants/file-uploads';

  constructor(private http: HttpClient) {}

  uploadPhoto(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/file-uploads`, formData);
}


  creerEtudiant(etudiant: Etudiant): Observable<CreationEtudiantResponse> {
    return this.http.post<CreationEtudiantResponse>(this.apiUrl, etudiant);
  }

  getEtudiant(id: string): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/${id}`);
  }

  mettreAJourEtudiant(id: string, etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.apiUrl}/${id}`, etudiant);
  }

  validerInscription(id: string): Observable<Etudiant> {
    return this.http.patch<Etudiant>(`${this.apiUrl}/${id}/valider`, {});
  }

  confirmerPaiement(id: string): Observable<Etudiant> {
    return this.http.patch<Etudiant>(`${this.apiUrl}/${id}/payer`, {});
  }
}
