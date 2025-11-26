import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreationEtudiantResponse, Etudiant } from '../interfaces/EtudiantInterface';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  private apiUrl = 'http://localhost:5000/api/etudiants';
  private uploadUrl = 'http://localhost:5000/api/etudiants/file-uploads';

  constructor(private http: HttpClient) {}

 uploadFiles(formData: FormData): Observable<{ photo: any; documents: any[] }> {
  return this.http.post<{ photo: any; documents: any[] }>(this.uploadUrl, formData);
}


  creerEtudiant(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/etudiants', data);
  }


  // ✅ Get étudiant par ID
  getEtudiant(id: string): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/${id}`);
  }

  // ✅ Get tous les étudiants
  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.apiUrl);
  }

  // ✅ Mise à jour étudiant
  mettreAJourEtudiant(id: string, etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.apiUrl}/${id}`, etudiant);
  }

  // ✅ Valider inscription
  validerInscription(id: string): Observable<Etudiant> {
    return this.http.patch<Etudiant>(`${this.apiUrl}/${id}/valider`, {});
  }
  rejeterInscription(id: string) {
  return this.http.patch(`${this.apiUrl}/etudiants/${id}/rejeter`, {});
}


  // ✅ Confirmer paiement
  confirmerPaiement(id: string): Observable<Etudiant> {
    return this.http.patch<Etudiant>(`${this.apiUrl}/${id}/payer`, {});
  }

 checkRegistration(): Observable<boolean> {
  const token = localStorage.getItem('token');
  console.log('Token trouvé dans localStorage:', token);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  return this.http.get<boolean>(`${this.apiUrl}/is-registered`, { headers });
}
// Get un département par ID
getDepartementById(id: string): Observable<{ _id: string; nom: string } | undefined> {
  return this.getDepartements().pipe(
    map((departements: { _id: string; nom: string }[]) =>
      departements.find((dep: { _id: string; nom: string }) => dep._id === id)
    )
  );
}

// Get une formation par ID
getFormationById(id: string): Observable<{ _id: string; nom: string } | undefined> {
  return this.getFormations().pipe(
    map((formations: { _id: string; nom: string }[]) =>
      formations.find((form: { _id: string; nom: string }) => form._id === id)
    )
  );
}


  // ✅ Get niveaux d'études
  // getNiveauxEtudes(): Observable<{ value: string; label: string }[]> {
  //   return this.http.get<any>('http://localhost:5000/api/niveaux-etudes').pipe(
  //     map((res: any) =>
  //       Object.keys(res).map((key) => ({ value: key, label: res[key] }))
  //     )
  //   );
  // }

  // ✅ Get départements
  getDepartements(): Observable<any> {
    return this.http
      .get<any>('http://localhost:5000/api/departements')
      .pipe(map((response) => response.data));
  }

  // ✅ Get formations
  getFormations(): Observable<any> {
    return this.http
      .get<any>('http://localhost:5000/api/formations')
      .pipe(map((response) => response.data));
  }
}
