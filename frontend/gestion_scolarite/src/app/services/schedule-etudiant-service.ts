import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CourseSlot, Teacher } from '../components/schedule-etudiant/schedule-etudiant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleEtudiantService {
   private apiUrl = 'http://localhost:5000/api/Schedule'; // ton backend

  constructor(private http: HttpClient) {}

 getSlots(): Observable<CourseSlot[]> {
  return this.http.get<CourseSlot[]>(this.apiUrl).pipe(
    map(slots => slots.map(slot => ({
      ...slot,
      teacher: typeof slot.teacher === 'object' ? slot.teacher : { nom: '', prenom: '' }
    })))
  );
}


  addSlot(slot: CourseSlot): Observable<CourseSlot> {
    return this.http.post<CourseSlot>(this.apiUrl, slot).pipe(
      map(saved => ({
        ...saved,
        teacher: typeof saved.teacher === 'object'
          ? saved.teacher
          : { nom: saved.teacher || 'Inconnu', prenom: '' } as Teacher,
        start: new Date(saved.start),
        end: new Date(saved.end)
      }))
    );
  }

  updateSlot(slot: CourseSlot): Observable<CourseSlot> {
    return this.http.put<CourseSlot>(`${this.apiUrl}/${slot._id}`, slot).pipe(
      map(updated => ({
        ...updated,
        teacher: typeof updated.teacher === 'object'
          ? updated.teacher
          : { nom: updated.teacher || 'Inconnu', prenom: '' } as Teacher,
        start: new Date(updated.start),
        end: new Date(updated.end)
      }))
    );
  }

  deleteSlot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 Notification simple
  addNotification(message: string) {
    alert(message);
  }
}

