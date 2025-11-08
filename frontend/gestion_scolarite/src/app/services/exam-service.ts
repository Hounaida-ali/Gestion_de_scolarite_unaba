import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamSlot } from '../components/exam/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:5000/api/Exam'; // URL backend

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les examens, avec filtres optionnels
  getExams(departement?: string, type?: string, room?: string): Observable<ExamSlot[]> {
    const params: any = {};
    if (departement) params.departement = departement;
    if (type) params.type = type;
    if (room) params.room = room;

    return this.http.get<ExamSlot[]>(this.apiUrl, { params });
  }

  // 🔹 Ajouter un examen
  addExam(exam: ExamSlot): Observable<ExamSlot> {
    return this.http.post<ExamSlot>(this.apiUrl, exam);
  }

  // 🔹 Mettre à jour un examen
  updateExam(exam: ExamSlot): Observable<ExamSlot> {
    if (!exam._id) throw new Error('ID de l’examen manquant pour la mise à jour');
    return this.http.put<ExamSlot>(`${this.apiUrl}/${exam._id}`, exam);
  }

  // 🔹 Supprimer un examen
  deleteExam(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 Récupérer un examen par ID (optionnel)
  getExamById(id: string): Observable<ExamSlot> {
    return this.http.get<ExamSlot>(`${this.apiUrl}/${id}`);
  }
}
