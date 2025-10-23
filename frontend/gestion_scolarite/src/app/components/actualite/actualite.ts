import { Component } from '@angular/core';
import { ActualiteService } from '../../services/actualite-service';
import { News } from '../../interfaces/actualiteInterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualite',
  imports: [CommonModule],
  templateUrl: './actualite.html',
  styleUrl: './actualite.css'
})
export class Actualite {
 actualites: News[] = [];
  loading = true;

  constructor(private actualiteService: ActualiteService) {}

  ngOnInit(): void {
  this.actualiteService.getActualites().subscribe({
    next: (data) => {
      this.actualites = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur :', err);
      this.loading = false;
    }
  });
}

  loadActualites(): void {
    this.actualiteService.getActualites().subscribe({
      next: (data) => {
        this.actualites = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des actualités:', error);
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}

