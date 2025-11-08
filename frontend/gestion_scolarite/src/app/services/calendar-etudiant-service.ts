import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../interfaces/eventInterface';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalendarEtudiantService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) { }

  getEvents(academicYear?: string, type?: string, semester?: number): Observable<Event[]> {
    let params = new HttpParams();
    if (academicYear) params = params.set('academicYear', academicYear);
    if (type) params = params.set('type', type);
    if (semester) params = params.set('semester', semester.toString());

    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEventsByAcademicYear(academicYear: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/year/${academicYear}`);
  }
  
  getUpcomingEvents(): Observable<Event[]> {
  return this.http.get<Event[]>(`${this.apiUrl}/upcoming/next`);
}
}

