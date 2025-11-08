import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamSlot } from '../components/exam/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamEtudiantService {
   private apiUrl = 'http://localhost:5000/api/Exam'; // backend exams

  constructor(private http: HttpClient) {}

  getExams(departement?: string, type?: string, room?: string): Observable<ExamSlot[]> {
    let url = this.apiUrl;
    const params: any = {};
    if (departement) params.departement = departement;
    if (type) params.type = type;
    if (room) params.room = room;

    return this.http.get<ExamSlot[]>(url, { params });
  }

  addExam(exam: ExamSlot): Observable<ExamSlot> {
    return this.http.post<ExamSlot>(this.apiUrl, exam);
  }

  updateExam(exam: ExamSlot): Observable<ExamSlot> {
    return this.http.put<ExamSlot>(`${this.apiUrl}/${exam._id}`, exam);
  }

  deleteExam(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

