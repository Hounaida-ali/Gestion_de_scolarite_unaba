import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id?: number;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: AppNotification[] = [];
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private counter = 0;

  add(notification: AppNotification) {
    notification.id = ++this.counter;
    console.log('Notification ajoutée :', notification);
    this.notifications.unshift(notification);
    this.notificationsSubject.next([...this.notifications]);

    setTimeout(() => this.removeById(notification.id!), 5000);
  }

  remove(index: number) {
    this.notifications.splice(index, 1);
    this.notificationsSubject.next([...this.notifications]);
  }
  private removeById(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }
  clear() {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }

  // 🔹 Raccourcis pratiques
  notifyAddExam(title: string, salle: string) {
    this.add({ type: 'success', text: `Examen "${title}" ajouté (salle ${salle})` });
  }

  notifyUpdateExam(title: string) {
    this.add({ type: 'info', text: `Examen "${title}" mis à jour` });
  }

  notifyDeleteExam(title: string) {
    this.add({ type: 'warning', text: `Examen "${title}" supprimé` });
  }
}
