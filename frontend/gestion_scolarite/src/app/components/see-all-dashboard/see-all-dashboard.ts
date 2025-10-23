import { Component, inject } from '@angular/core';
import { SeeAllDashboardService, Dashboard } from '../../services/see-all-dashboard-service';
import { CommonModule } from '@angular/common';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogModal } from '../dialog-modal/dialog-modal';

@Component({
  selector: 'app-see-all-dashboard',
  imports: [CommonModule],
  templateUrl: './see-all-dashboard.html',
  styleUrl: './see-all-dashboard.css',
})
export class SeeAllDashboard {
  readonly dialogRef = inject(DialogRef<string>);
  readonly data = inject(DIALOG_DATA);

  seeAllDashboards: Dashboard[] = [];
  selectedItem: Dashboard | null = null;
  loading = true;

  readonly dialog = inject(Dialog);

  constructor(private seeAllDashboardService: SeeAllDashboardService) {}

  ngOnInit(): void {
    this.seeAllDashboardService.getAllSeeAllDashboards().subscribe({
      next: (data) => {
        this.seeAllDashboards = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des éléments du tableau de bord :', err);
        this.loading = false;
      },
    });
  }

  closeMainModal(result?: string) {
    this.dialogRef.close(result);
  }

  // ✅ Ouvre la modale avec les infos de la carte
  // openModal(item: Dashboard): void {
  //   this.selectedItem = item;
  // }
  
  openModal(index: number): void {
  const dialogRef = this.dialog.open(DialogModal, {
    width: '75%',
    data: { dashboard: this.seeAllDashboards[index] },
  });

  dialogRef.closed.subscribe((result) => {
    console.log('Dashboard modal closed with result:', result);
  });
}

  // ✅ Ferme la modale
  closeModal(): void {
    this.selectedItem = null;
  }
}
