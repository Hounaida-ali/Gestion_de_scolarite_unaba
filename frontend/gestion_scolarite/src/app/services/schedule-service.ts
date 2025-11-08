import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseSlot } from '../components/schedule/schedule';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = 'http://localhost:5000/api/Schedule'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les créneaux, avec filtres optionnels
  getSlots(
    departement?: string,
    filiere?: string,
    niveau?: string,
    teacher?: string
  ): Observable<CourseSlot[]> {
    let params = new HttpParams();
    if (departement) params = params.set('departement', departement);
    if (filiere) params = params.set('filiere', filiere);
    if (niveau) params = params.set('niveau', niveau);
    if (teacher) params = params.set('teacher', teacher);

    return this.http.get<CourseSlot[]>(this.apiUrl, { params });
  }

  // 🔹 Ajouter un créneau
  addSlot(slot: CourseSlot): Observable<CourseSlot> {
    return this.http.post<CourseSlot>(this.apiUrl, slot);
  }

  // 🔹 Mettre à jour un créneau
  updateSlot(slot: CourseSlot): Observable<CourseSlot> {
    if (!slot._id) throw new Error('ID du créneau manquant pour la mise à jour');
    return this.http.put<CourseSlot>(`${this.apiUrl}/${slot._id}`, slot);
  }

  // 🔹 Supprimer un créneau
  deleteSlot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 Récupérer un créneau par ID
  getSlotById(id: string): Observable<CourseSlot> {
    return this.http.get<CourseSlot>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Notification (peut être remplacé par un service Angular Material Snackbar)
  addNotification(message: string) {
    alert(message);
  }
}
