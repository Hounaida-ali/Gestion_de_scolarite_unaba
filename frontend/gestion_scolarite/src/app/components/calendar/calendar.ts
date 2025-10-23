import { Component } from '@angular/core';
import { EventService } from '../../services/event-service';
import { AcademicYearsService } from '../../services/academic-years-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../interfaces/eventInterface';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
 events: Event[] = [];
  academicYears: string[] = [];
  selectedAcademicYear: string = '2025-2026';
  selectedFilter: string = 'all';
  selectedSemester: number | null = null;

  constructor(
    private eventService: EventService,
    private academicYearService: AcademicYearsService
  ) { }

  ngOnInit(): void {
    this.loadAcademicYears();
    this.loadEvents();
  }

  loadAcademicYears(): void {
    this.academicYearService.getAcademicYears().subscribe(
      years => {
        this.academicYears = years;
        if (years.length > 0 && !this.selectedAcademicYear) {
          this.selectedAcademicYear = years[0];
        }
      }
    );
  }

  loadEvents(): void {
    this.eventService.getEvents(
      this.selectedAcademicYear,
      this.selectedFilter === 'all' ? undefined : this.selectedFilter,
      this.selectedSemester || undefined
    ).subscribe(
      events => this.events = events
    );
  }

  onAcademicYearChange(): void {
    this.loadEvents();
  }

  onFilterChange(): void {
    this.loadEvents();
  }

  onSemesterChange(): void {
    this.loadEvents();
  }

  // NOUVELLE MÉTHODE POUR LES ÉVÉNEMENTS À VENIR
  showUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe(
      upcomingEvents => {
        if (upcomingEvents.length > 0) {
          const nextEvent = upcomingEvents[0];
          const eventDate = this.formatDate(nextEvent.date);
          alert(`Prochain événement: ${nextEvent.title} le ${eventDate}`);
          
          // Optionnel: Filtrer pour montrer seulement les événements à venir
          this.events = upcomingEvents;
          this.selectedFilter = 'all';
          this.selectedSemester = null;
        } else {
          alert('Aucun événement à venir');
        }
      },
      error => {
        alert('Erreur lors du chargement des événements à venir');
      }
    );
  }
  
  getEventTypeClass(type: string): string {
    return `event-type ${type}`;
  }

  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'cours': 'Cours',
      'examen': 'Examen',
      'vacances': 'Vacances',
      'ferie': 'Jour férié',
      'autre': 'Autre'
    };
    return labels[type] || 'Événement';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getEventsBySemester(semester: number): Event[] {
    return this.events.filter(event => event.semester === semester);
  }
}
