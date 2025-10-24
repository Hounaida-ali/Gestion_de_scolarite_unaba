import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AllNewsService, News } from '../../services/all-news-service';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogModal } from '../dialog-modal/dialog-modal';

@Component({
  selector: 'app-all-news',
  imports: [CommonModule],
  templateUrl: './all-news.html',
  styleUrl: './all-news.css',
})
export class AllNews {
  readonly dialog = inject(Dialog);
  
  readonly dialogRef = inject(DialogRef<string>);
  readonly data = inject(DIALOG_DATA);

  allNews: News[] = [];
  loading = true;

  constructor(private allNewsService: AllNewsService) {}

  ngOnInit(): void {
    this.allNewsService.getAllNews().subscribe({
      next: (data) => {
        this.allNews = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des actualités :', err);
        this.loading = false;
      },
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  closeModal(result?: string) {
    this.dialogRef.close(result);
  }
  openModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '65%',
      data: { news: this.allNews[index] },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('AllNews modal closed with result:', result);
    });
  }
}
