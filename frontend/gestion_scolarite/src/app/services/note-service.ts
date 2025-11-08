import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluation } from '../interfaces/evaluationInterface';
import { AddEvaluationPayload } from '../interfaces/addEvaluationInterface';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
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

  addEvaluation(payload: AddEvaluationPayload) {
    return this.http.post('/api/Note', payload);
  }
  // /** 🔹 Ajouter une nouvelle note */
  // addEvaluation(evaluation: Evaluation): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, evaluation);
  // }

  /** 🔹 Mettre à jour une note existante */
  // Mettre à jour le type du paramètre pour le payload
  updateEvaluation(id: string, payload: AddEvaluationPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  /** 🔹 Supprimer une note */
  deleteEvaluation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
