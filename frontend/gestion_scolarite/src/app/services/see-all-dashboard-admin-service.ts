import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Dashboard {
  _id?: string;
  titre: string;
  contenu: string;
  icon: string;
  actionText: string;
  sousTitre?: string;
  modalDescription?: string;
  details?: string[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SeeAllDashboardAdminService {
  private apiUrl = 'http://localhost:5000/api/SeeAllDashboard'; // ton API backend

  constructor(private http: HttpClient) {}

  getAllSeeAllDashboards(): Observable<Dashboard[]> {
    return this.http
      .get<{ success: boolean; data: Dashboard[]; count: number }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getSeeAllDashboardById(id: string): Observable<Dashboard> {
    return this.http
      .get<{ success: boolean; data: Dashboard }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createSeeAllDashboard(item: Dashboard): Observable<Dashboard> {
    return this.http
      .post<{ success: boolean; data: Dashboard }>(this.apiUrl, item)
      .pipe(map(response => response.data));
  }

  updateSeeAllDashboard(id: string, item: Dashboard): Observable<Dashboard> {
    return this.http
      .put<{ success: boolean; data: Dashboard }>(`${this.apiUrl}/${id}`, item)
      .pipe(map(response => response.data));
  }

  deleteSeeAllDashboard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


