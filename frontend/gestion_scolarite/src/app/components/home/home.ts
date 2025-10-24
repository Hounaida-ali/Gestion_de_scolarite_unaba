import { Component, inject } from '@angular/core';
import { HomeService, Dashboard } from '../../services/home-service';
import { CommonModule } from '@angular/common';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  // template: ``,
  styleUrl: './home.css',
})
export class Home {
  readonly dialog = inject(Dialog);

  homeDashboards: Dashboard[] = [];
  loading = true;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getAllDashboards().subscribe({
      next: (data) => {
        // Backend renvoie { success, data, count }
        this.homeDashboards = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des dashboards :', err);
        this.loading = false;
      },
    });
  }

  openModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '75%',
      data: { dashboard: this.homeDashboards[index] },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('actualite modal closed with result:', result);
    });
  }
}
