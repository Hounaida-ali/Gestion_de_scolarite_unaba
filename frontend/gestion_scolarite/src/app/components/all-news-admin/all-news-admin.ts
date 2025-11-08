import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AllNewsAdminService, News } from '../../services/all-news-admin-service';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { Dialog } from '@angular/cdk/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-news-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './all-news-admin.html',
  styleUrls: ['./all-news-admin.css']
})
export class AllNewsAdmin {
  readonly dialog = inject(Dialog);

  allNews: News[] = [];
  loading = true;

  successMessage = '';
  errorMessage = '';

  newsForm!: FormGroup;
  showForm = false;
  editMode = false;
  currentId: string | null = null;

  constructor(
    private allNewsAdminService: AllNewsAdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadNews();
  }

  /** 🔹 Initialisation du formulaire */
  initForm() {
    this.newsForm = this.fb.group({
      titre: ['', Validators.required],
      contenu: ['', Validators.required],
      date: ['', Validators.required],
      actionText: ['', Validators.required],
      sousTitre: [''],
      modalDescription: [''],
      details: this.fb.array([]),
      status: [''],
    });
  }

  get details(): FormArray {
    return this.newsForm.get('details') as FormArray;
  }

  addDetail() {
    this.details.push(this.fb.control(''));
  }

  removeDetail(i: number) {
    this.details.removeAt(i);
  }

  /** 🔹 Charger toutes les actualités */
  loadNews() {
    this.loading = true;
    this.allNewsAdminService.getAllNews().subscribe({
      next: (res: any) => {
        this.allNews = Array.isArray(res.data) ? res.data : res;
        this.loading = false;
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des actualités', 'error');
        this.loading = false;
      },
    });
  }

  /** 🔹 Cliquer sur “Ajouter une actualité” */
  newActualite() {
    this.resetForm();
    this.showForm = true;
    this.editMode = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  /** 🔹 Cliquer sur “Modifier” */
  editActualite(news: News) {
    this.editMode = true;
    this.currentId = (news as any)._id;

    this.newsForm.patchValue(news);
    this.details.clear();
    (news.details || []).forEach((d) => this.details.push(this.fb.control(d)));

    this.showForm = true;
  }

  /** 🔹 Soumettre le formulaire */
  onSubmit() {
    if (this.newsForm.invalid) return;

    const formData = this.newsForm.value;

    if (this.editMode && this.currentId) {
      // ✅ Mise à jour
      this.allNewsAdminService.updateNews(this.currentId, formData).subscribe({
        next: (res: any) => {
          this.loadNews();
          this.resetForm();
          this.showMessage(res.message || 'Actualité mise à jour avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la mise à jour', 'error');
        },
      });
    } else {
      // ✅ Création
      this.allNewsAdminService.createNews(formData).subscribe({
        next: (res: any) => {
          this.loadNews();
          this.resetForm();
          this.showMessage(res.message || 'Actualité ajoutée avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la création', 'error');
        },
      });
    }
  }

  /** 🔹 Supprimer une actualité */
  deleteActualite(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette actualité ?')) {
      this.allNewsAdminService.deleteNews(id).subscribe({
        next: (res: any) => {
          this.loadNews();
          this.showMessage(res.message || 'Actualité supprimée avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la suppression', 'error');
        },
      });
    }
  }

  /** 🔹 Réinitialiser et cacher le formulaire */
  resetForm() {
    this.newsForm.reset();
    this.details.clear();
    this.showForm = false;
    this.editMode = false;
    this.currentId = null;
  }

  /** 🔹 Formater la date */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /** 🔹 Ouvrir la modale (lecture) */
  openModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '65%',
      data: { news: this.allNews[index] },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('Modal fermée avec résultat :', result);
    });
  }

  /** 🔹 Messages temporaires */
  showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), duration);
    } else {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), duration);
    }
  }
}
