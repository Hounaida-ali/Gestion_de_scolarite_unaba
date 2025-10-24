import { Component, inject } from '@angular/core';
import { AccesRapide, QuickAccessService } from '../../services/quick-access-service';
import { CommonModule } from '@angular/common';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-quick-access',
  imports: [CommonModule],
  templateUrl: './quick-access.html',
  styleUrl: './quick-access.css',
})
export class QuickAccess {
  readonly dialog = inject(Dialog);

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
      },
    });
  }
  penModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '75%',
      data: { acces: this.accesRapides[index] },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('actualite modal closed with result:', result);
    });
  }

  // ✅ Ferme la modale
  // closeModal(): void {
  //   this.selectedItem = null;
  // }
}
