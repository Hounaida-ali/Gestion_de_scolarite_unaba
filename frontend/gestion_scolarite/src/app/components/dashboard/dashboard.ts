import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { Actualite } from "../actualite/actualite";
import { QuickAccess } from "../quick-access/quick-access";
import { Home } from '../home/home';
import { SeeAllDashboard } from '../see-all-dashboard/see-all-dashboard';
import { AllNews } from '../all-news/all-news';

@Component({
  selector: 'app-dashboard',
  imports: [DialogModule, Actualite, QuickAccess, Home],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  readonly dialog = inject(Dialog); // Inject the Dialog service from @angular/cd/dialog

  openDashBoardModal(): void {
    const dialogRef = this.dialog.open(SeeAllDashboard, {
      width: '75%',
      data: { message: 'Test' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('Dashboard Model Closer with result:', result);
    });
  }

  openActualitiesModal(): void {
    const dialogRef = this.dialog.open(AllNews, {
      width: '75%',
      data: { message: 'Test' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('Dashboard Model Closer with result:', result);
    });
  }
}
