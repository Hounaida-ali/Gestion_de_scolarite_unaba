import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Dashboard {
  _id?: string;
  titre: string;
  contenu: string;
  label: string;
  labelIcon?: string;
  icon: string;
  actionText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:5000/api/Dashboard';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les dashboards
  getAllDashboards(): Observable<Dashboard[]> {
    return this.http
      .get<{ success: boolean; data: Dashboard[]; count: number }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // ✅ Récupérer un dashboard par ID
  getDashboardById(id: string): Observable<Dashboard> {
    return this.http
      .get<{ success: boolean; data: Dashboard }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // ✅ Créer un nouveau dashboard
  createDashboard(dashboard: Dashboard): Observable<Dashboard> {
    return this.http
      .post<{ success: boolean; data: Dashboard }>(this.apiUrl, dashboard)
      .pipe(map(response => response.data));
  }

  // ✅ Mettre à jour un dashboard
  updateDashboard(id: string, dashboard: Dashboard): Observable<Dashboard> {
    return this.http
      .put<{ success: boolean; data: Dashboard }>(`${this.apiUrl}/${id}`, dashboard)
      .pipe(map(response => response.data));
  }

  // ✅ Supprimer un dashboard
  deleteDashboard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

