import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Formation } from '../interfaces/formationInterface';
import { DepartementAvecFormations } from '../interfaces/DepartementAvecFormations';
import { ApiResponse } from './event-service';
import { Programme } from '../interfaces/ProgramInterface';

@Injectable({
  providedIn: 'root'
})
export class FormationEtudiantService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}
  getDepartementsAvecFormations(): Observable<DepartementAvecFormations[]> {
  return this.getDepartements().pipe(
    switchMap((departements: any[]) => {
      const requests: Observable<Formation[]>[] = departements.map(dep =>
        this.getFormationsByDepartement(dep._id)
      );

      return forkJoin(requests).pipe(
        map((formationsParDep: Formation[][]) =>
          departements.map((dep, i) => ({
            _id: dep._id,
            nom: dep.nom,
            description: dep.description,
            formations: formationsParDep[i] || []
          }))
        )
      );
    })
  );
  }
  // Récupérer toutes les formations
  getFormations(): Observable<Formation[]> {
    return this.http
      .get<ApiResponse<Formation[]>>(`${this.apiUrl}/formations`)
      .pipe(map((response) => response.data || []));
  }
  // Récupérer les formations par département
  getFormationsByDepartement(departementId: string): Observable<Formation[]> {
    return this.http
      .get<ApiResponse<Formation[]>>(`${this.apiUrl}/formations/departement/${departementId}`)
      .pipe(map((response) => response.data || []));
  }
getDepartements(): Observable<any[]> {
  return this.http.get(`${this.apiUrl}/departements`).pipe(
    map((res: any) => {
      console.log('Réponse brute départements :', res);
      return res.data || res;
    })
  );
}
  // Récupérer une formation par ID
  getFormationById(id: string): Observable<Formation> {
    return this.http
      .get<ApiResponse<Formation>>(`${this.apiUrl}/formations/${id}`)
      .pipe(map((response) => response.data!));
  }

  // Récupérer un programme spécifique
  getProgramme(departement: string, code: string): Observable<Programme> {
    return this.http
      .get<ApiResponse<Programme>>(`${this.apiUrl}/programmes/${departement}/${code}`)
      .pipe(map((response) => response.data!));
  }

  // Récupérer tous les programmes
  getAllProgrammes(): Observable<Programme[]> {
    return this.http
      .get<ApiResponse<Programme[]>>(`${this.apiUrl}/programmes`)
      .pipe(map((response) => response.data || []));
  }

  // Créer une nouvelle formation
  createFormation(formation: Partial<Formation>): Observable<Formation> {
  return this.http
    .post<ApiResponse<Formation>>(`${this.apiUrl}/formations`, formation)
    .pipe(map((response) => response.data!));
}


  // Mettre à jour une formation
  updateFormation(id: string, formation: Partial<Formation>): Observable<Formation> {
    return this.http
      .put<ApiResponse<Formation>>(`${this.apiUrl}/formations/${id}`, formation)
      .pipe(map((response) => response.data!));
  }
  // <-- Ajoute cette méthode
  deleteFormation(id: string): Observable<any> {
  return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/formations/${id}`);
}

}
