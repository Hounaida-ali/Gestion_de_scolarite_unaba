import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id?: number;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationScheduleService {
  private notifications: AppNotification[] = [];
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private counter = 0;

  // 🔹 Ajouter une notification
  add(notification: AppNotification) {
    notification.id = ++this.counter;
    console.log('Notification ajoutée :', notification);
    this.notifications.unshift(notification);
    this.notificationsSubject.next([...this.notifications]);

    // Supprimer automatiquement après 5s
    setTimeout(() => this.removeById(notification.id!), 5000);
  }

  // 🔹 Supprimer par index
  remove(index: number) {
    this.notifications.splice(index, 1);
    this.notificationsSubject.next([...this.notifications]);
  }

  // 🔹 Supprimer par ID
  private removeById(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }

  // 🔹 Tout supprimer
  clear() {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }

  // 🔹 Raccourcis pratiques pour les cours
  notifyAddCourse(title: string, room: string) {
    this.add({ type: 'success', text: `Cours "${title}" ajouté (salle ${room})` });
  }

  notifyUpdateCourse(title: string) {
    this.add({ type: 'info', text: `Cours "${title}" mis à jour` });
  }

  notifyDeleteCourse(title: string) {
    this.add({ type: 'warning', text: `Cours "${title}" supprimé` });
  }

  notifyCancelCourse(title: string) {
    this.add({ type: 'error', text: `Cours "${title}" annulé` });
  }

  notifyActivateCourse(title: string) {
    this.add({ type: 'success', text: `Cours "${title}" réactivé` });
  }
}
