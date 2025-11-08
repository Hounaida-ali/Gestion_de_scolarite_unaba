import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../interfaces/eventInterface';

// 👇 Ajout du type générique pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  event?: T;
  data?: T; // (optionnel si le backend renvoie "data" à la place de "event")
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les événements (avec filtres éventuels)
  getEvents(academicYear?: string, type?: string, semester?: number): Observable<Event[]> {
    let params = new HttpParams();
    if (academicYear) params = params.set('academicYear', academicYear);
    if (type) params = params.set('type', type);
    if (semester) params = params.set('semester', semester.toString());

    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  // 🔹 Récupérer un seul événement
  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Créer un événement → renvoie { success, message, event }
  createEvent(event: Event): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(this.apiUrl, event);
  }

  // 🔹 Mettre à jour un événement → renvoie { success, message, event }
  updateEvent(id: string, event: Event): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}`, event);
  }

  // 🔹 Supprimer un événement → renvoie { success, message }
  deleteEvent(id: string): Observable<ApiResponse<Event>> {
    return this.http.delete<ApiResponse<Event>>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Récupérer par année scolaire
  getEventsByAcademicYear(academicYear: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/year/${academicYear}`);
  }

  // 🔹 Récupérer les prochains événements
  getUpcomingEvents(): Observable<Event[]> {
  return this.http.get<Event[]>(`${this.apiUrl}/upcoming/next`);
}
}
