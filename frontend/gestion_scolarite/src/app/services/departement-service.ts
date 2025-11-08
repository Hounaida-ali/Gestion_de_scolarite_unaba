import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = 'http://localhost:5000/api/departements'; // adapte l'URL selon ton backend

  constructor(private http: HttpClient) {}

  // ✅ On mappe la réponse pour récupérer seulement le tableau "data"
  getAll(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data) // <- important !
    );
  }

  create(dep: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dep);
  }

  update(id: string, dep: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dep);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
