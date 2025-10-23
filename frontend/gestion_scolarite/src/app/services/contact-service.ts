import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../components/contact/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5000/api/contact'; // 👉 adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Enregistrer un message
  saveMessage(contact: Contact): Observable<any> {
  return this.http.post(`${this.apiUrl}/saveMessage`, contact);
}


  // Récupérer tous les messages
  getMessages(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}`);
  }

  // Répondre à un message
  replyMessage(id: string, reply: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { reply });
  }
}
