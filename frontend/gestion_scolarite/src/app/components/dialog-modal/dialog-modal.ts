import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Dashboard } from '../../services/see-all-dashboard-service';

@Component({
  selector: 'app-dashboard-modal',
  standalone: true, // if using standalone components
  imports: [CommonModule],
  templateUrl: './dialog-modal.html',
  styleUrls: ['./dialog-modal.css']
})
export class DialogModal {
  readonly dialogRef = inject(DialogRef);
  readonly data = inject(DIALOG_DATA) as { dashboard: Dashboard };

  close() {
    this.dialogRef.close('closed');
  }
}
