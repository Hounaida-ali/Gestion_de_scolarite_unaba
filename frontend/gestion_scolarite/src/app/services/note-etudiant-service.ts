import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../interfaces/evaluationInterface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteEtudiantService {
  private apiUrl = 'http://localhost:5000/api/Note'; // correspond au backend

  constructor(private http: HttpClient) {}

  /** 🔹 Récupérer toutes les notes */
  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  /** 🔹 Récupérer une note par ID */
  getEvaluationById(id: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Ajouter une nouvelle note */
  addEvaluation(evaluation: Evaluation): Observable<any> {
    return this.http.post<any>(this.apiUrl, evaluation);
  }

  /** 🔹 Mettre à jour une note existante */
  updateEvaluation(id: string, evaluation: Evaluation): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, evaluation);
  }

  /** 🔹 Supprimer une note */
  deleteEvaluation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}


