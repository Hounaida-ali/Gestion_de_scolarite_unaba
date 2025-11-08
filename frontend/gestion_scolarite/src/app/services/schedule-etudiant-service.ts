import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseSlot } from '../components/schedule/schedule';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleEtudiantService {
   private apiUrl = 'http://localhost:5000/api/Schedule'; // ton backend
constructor(private http: HttpClient) {}

  getSlots(): Observable<CourseSlot[]> {
    return this.http.get<CourseSlot[]>(this.apiUrl);
  }

  addSlot(slot: CourseSlot): Observable<CourseSlot> {
    return this.http.post<CourseSlot>(this.apiUrl, slot);
  }

  updateSlot(slot: CourseSlot): Observable<CourseSlot> {
    return this.http.put<CourseSlot>(`${this.apiUrl}/${slot._id}`, slot);
  }

  deleteSlot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addNotification(message: string) {
    alert(message);
  }
}

