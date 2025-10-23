import { Component } from '@angular/core';
import { AccesRapide, QuickAccessService } from '../../services/quick-access-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-access',
  imports: [CommonModule],
  templateUrl: './quick-access.html',
  styleUrl: './quick-access.css'
})
export class QuickAccess {
 accesRapides: AccesRapide[] = [];
  loading = true;

  constructor(private quickAccessService: QuickAccessService) {}

  ngOnInit(): void {
    // Même logique que pour les actualités, mais adaptée au service AccesRapide
    this.quickAccessService.getAccesRapides().subscribe({
      next: (data) => {
        // Si ton backend renvoie { success, data, count }
        this.accesRapides = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des accès rapides :', err);
        this.loading = false;
      }
    });
  }

}