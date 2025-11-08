import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event-service';
import { AcademicYearsService } from '../../services/academic-years-service';
import { Event } from '../../interfaces/eventInterface';
import { ApiResponse } from '../../interfaces/apiInterface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class Calendar {
  events: Event[] = [];
  academicYears: string[] = [];
  selectedAcademicYear: string = '2025-2026';
  selectedFilter: string = 'all';
  selectedSemester: number | null = null;

  // Formulaire
  showEventForm = false;
  selectedEvent: Event | null = null;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private eventService: EventService,
    private academicYearService: AcademicYearsService
  ) {}

  ngOnInit(): void {
    this.loadAcademicYears();
    this.loadEvents();
  }

  // 🔹 Charger les années académiques
  loadAcademicYears(): void {
    this.academicYearService.getAcademicYears().subscribe({
      next: (years) => {
        this.academicYears = years;
        if (years.length > 0 && !this.selectedAcademicYear) {
          this.selectedAcademicYear = years[0];
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des années académiques.';
      },
    });
  }

  // 🔹 Charger les événements
  loadEvents(): void {
    this.eventService
      .getEvents(
        this.selectedAcademicYear,
        this.selectedFilter === 'all' ? undefined : this.selectedFilter,
        this.selectedSemester || undefined
      )
      .subscribe({
        next: (events) => (this.events = events),
        error: () => (this.errorMessage = 'Erreur lors du chargement des événements.'),
      });
  }

  // 🔹 Rafraîchir après filtrage
  onAcademicYearChange(): void {
    this.loadEvents();
  }
  onFilterChange(): void {
    this.loadEvents();
  }
  onSemesterChange(): void {
    this.loadEvents();
  }

  // 🔹 Événements à venir
  showUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (upcomingEvents) => {
        if (upcomingEvents.length > 0) {
          const nextEvent = upcomingEvents[0];
          alert(`Prochain événement: ${nextEvent.title} le ${this.formatDate(nextEvent.date)}`);
          this.events = upcomingEvents;
        } else {
          alert('Aucun événement à venir');
        }
      },
      error: () => alert('Erreur lors du chargement des événements à venir'),
    });
  }

  // 🔹 Style et libellé du type d'événement
  getEventTypeClass(type: string): string {
    return `event-type ${type}`;
  }

  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      cours: 'Cours',
      examen: 'Examen',
      vacances: 'Vacances',
      ferier: 'Jour férié',
      autre: 'Autre',
    };
    return labels[type] || 'Événement';
  }

  // 🔹 Format de date
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // 🔹 Séparer les événements par semestre
  getEventsBySemester(semester: number): Event[] {
    return this.events.filter((event) => event.semester === semester);
  }

  // 🔹 Nouveau formulaire — ajouter un événement
  newCalendar(): void {
    this.selectedEvent = {
      _id: '',
      title: '',
      description: '',
      date: new Date(),
      type: 'cours',
      period: '',
      academicYear: this.selectedAcademicYear || '2025-2026',
      semester: (this.selectedSemester ?? 1) as 1 | 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.showEventForm = true;
  }

  // 🔹 Enregistrer (ajout ou mise à jour)
  // 🔹 Enregistrer (ajout ou mise à jour)
  // 🔹 Enregistrer (ajout ou mise à jour)
  saveEvent(): void {
  if (!this.selectedEvent) return;

  const payload: any = {
    title: this.selectedEvent.title,
    description: this.selectedEvent.description,
    date: this.selectedEvent.date instanceof Date
      ? this.selectedEvent.date.toISOString()
      : this.selectedEvent.date,
    type: this.selectedEvent.type,
    period: this.selectedEvent.period,
    academicYear: this.selectedEvent.academicYear,
    semester: this.selectedEvent.semester
  };

  const isUpdate = !!this.selectedEvent._id;
  if (isUpdate) payload._id = this.selectedEvent._id;

  if (isUpdate) {
    this.eventService.updateEvent(payload._id!, payload).subscribe({
      next: (res: any) => {
        const message = res?.message || 'Événement mis à jour avec succès';
        const updatedEvent = res?.event ?? res; // <-- res peut être directement l'Event

        const index = this.events.findIndex((e) => e._id === payload._id);
        if (index !== -1) this.events[index] = updatedEvent;

        this.showMessage(message, 'success');
        this.resetForm();
        this.loadEvents();
      },
      error: (err) => {
        const message = err?.error?.message || "Erreur lors de la mise à jour de l'événement";
        this.showMessage(message, 'error');
      }
    });
  } else {
    this.eventService.createEvent(payload).subscribe({
      next: (res: any) => {
        const message = res?.message || 'Événement ajouté avec succès';
        const newEvent = res?.event ?? res; // <-- res peut être directement l'Event

        this.events.push(newEvent);
        this.showMessage(message, 'success');
        this.resetForm();
        this.loadEvents();
      },
      error: (err) => {
        const message = err?.error?.message || "Erreur lors de l'ajout de l'événement";
        this.showMessage(message, 'error');
      }
    });
  }
}

  // 🔹 Édition
  editEvent(event: Event): void {
    this.selectedEvent = { ...event };
    this.showEventForm = true;
  }

  // 🔹 Suppression
  deleteEvent(event: Event): void {
  if (!event._id) return;
  if (!confirm(`Supprimer l'événement "${event.title}" ?`)) return;

  this.eventService.deleteEvent(event._id).subscribe({
    next: (res: any) => {
      const message = res?.message || 'Événement supprimé avec succès';
      this.events = this.events.filter((e) => e._id !== event._id);
      this.showMessage(message, 'success');
    },
    error: (err) => {
      const message = err?.error?.message || "Erreur lors de la suppression de l'événement";
      this.showMessage(message, 'error');
    }
  });
}


  // 🔹 Réinitialisation du formulaire
  resetForm(): void {
    this.selectedEvent = null;
    this.showEventForm = false;
  }

  // 🔹 Messages temporaires
  showMessage(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ''), 3000);
    } else {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  // // 🔹 Actualiser la page
  // refreshPage(): void {
  //   this.loadEvents();
  // }
}
