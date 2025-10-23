import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Programme } from '../interfaces/ProgramInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceProgram {
  private apiUrl = 'http://localhost:3000/programmes';
   // ⚠️ Mets l'URL de ton backend ici 
   constructor(private http: HttpClient) {} 
   // Récupérer tous les programmes 
   getAllPrograms(): Observable<Programme[]> { 
    return this.http.get<Programme[]>(`${this.apiUrl}`); 
  } 
   // Récupérer un programme par département et code 
    getProgramByDepAndCode(departement: string, code: string): Observable<Programme> { 
      return this.http.get<Programme>(`${this.apiUrl}/${departement}/${code}`); 
    } 
  }
