import { Component } from '@angular/core';
import { Enseignant } from '../../interfaces/enseignantInterface';
import { Subscription } from 'rxjs';
import { EnseignantService } from '../../services/enseignant-service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

export interface Cours {
  _id?: string;
  title: string;           
  filiere: string;         
  niveau: string;          
  group?: string;          
  room?: string;           
  start: string | Date;  
  end: string | Date;      
  enseignantId?: string;   
}

@Component({
  selector: 'app-profil-enseignent',
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './profil-enseignent.html',
  styleUrl: './profil-enseignent.css',
})
export class ProfilEnseignent {
enseignant: Enseignant | null = null;
  emploiDuTemps: Cours[] = [];
  coursAssignes: Cours[] = [];
  stats: any = {};
  today = new Date();

  private subscriptions = new Subscription();

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit() {
    this.loadEnseignantData();
  }

  loadEnseignantData() {
    this.subscriptions.add(
      this.enseignantService.getCurrentEnseignant().subscribe({
        next: (enseignant: Enseignant) => {
          this.enseignant = enseignant;
          this.loadEmploiDuTemps();
          this.loadCoursAssignes();
          this.loadStats();
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement de l’enseignant :', error);
        }
      })
    );
  }

  loadEmploiDuTemps() {
    if (!this.enseignant?._id) return;

    this.subscriptions.add(
      this.enseignantService.getEmploiDuTemps(this.enseignant._id).subscribe({
        next: (cours: Cours[]) => {
          this.emploiDuTemps = cours.sort(
            (a, b) =>
              new Date(a.start).getTime() - new Date(b.start).getTime()
          );
        },
        error: (error: any) => {
          console.error('Erreur emploi du temps :', error);
        }
      })
    );
  }

  loadCoursAssignes() {
    if (!this.enseignant?._id) return;

    this.subscriptions.add(
      this.enseignantService.getCoursAssignes(this.enseignant._id).subscribe({
        next: (cours: Cours[]) => {
          this.coursAssignes = cours;
        },
        error: (error: any) => {
          console.error('Erreur cours assignés :', error);
        }
      })
    );
  }

  loadStats() {
    if (!this.enseignant?._id) return;

    this.subscriptions.add(
      this.enseignantService.getStatsEnseignant(this.enseignant._id).subscribe({
        next: (stats: any) => {
          this.stats = stats;
        },
        error: (error: any) => {
          console.error('Erreur stats enseignant :', error);
        }
      })
    );
  }

  getHeuresSemaine(): number {
    return this.coursAssignes.reduce((total, cours) => {
      const start = new Date(cours.start).getTime();
      const end = new Date(cours.end).getTime();
      return total + (end - start) / (1000 * 60 * 60);
    }, 0);
  }

  getCoursAujourdhui(): number {
    return this.emploiDuTemps.length;
  }

  getSallesDifferentes(): number {
    const salles = new Set(this.emploiDuTemps.map(c => c.room));
    return salles.size;
  }

  getBadgeType(group?: string): string {
    switch (group) {
      case 'TD':
        return 'info';
      case 'TP':
        return 'success';
      case 'Cours':
        return 'primary';
      default:
        return 'secondary';
    }
  }

  getDureeCours(cours: Cours): number {
    const start = new Date(cours.start).getTime();
    const end = new Date(cours.end).getTime();
    return (end - start) / (1000 * 60 * 60);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDayName(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}