import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearsService {
   private apiUrl = 'http://localhost:5000/api/academic-years';

  constructor(private http: HttpClient) { }

  getAcademicYears(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
