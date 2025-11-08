import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActualiteAdminService } from '../../services/actualite-admin-service';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { Dialog } from '@angular/cdk/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { News } from '../../interfaces/actualiteInterface';

@Component({
  selector: 'app-actualite-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actualite-admin.html',
  styleUrls: ['./actualite-admin.css']
})
export class ActualiteAdmin {
  readonly dialog = inject(Dialog);

  actualites: News[] = [];
  loading = true;

  successMessage = '';
  errorMessage = '';

  newsForm!: FormGroup;
  showForm = false;
  editMode = false;
  currentId: string | null = null;

  constructor(
    private actualiteAdminService: ActualiteAdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadActualites();
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
      status: ['']
    });
  }

  /** 🔹 Getter pour la liste des détails */
  get details(): FormArray {
    return this.newsForm.get('details') as FormArray;
  }

  /** 🔹 Ajouter / retirer un détail */
  addDetail() {
    this.details.push(this.fb.control(''));
  }

  removeDetail(i: number) {
    this.details.removeAt(i);
  }

  /** 🔹 Charger toutes les actualités */
  loadActualites() {
    this.loading = true;
    this.actualiteAdminService.getActualites().subscribe({
      next: (res: any) => {
        this.actualites = Array.isArray(res.data) ? res.data : res;
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
  editActualite(actualite: News) {
    this.editMode = true;
    this.currentId = (actualite as any)._id;

    this.newsForm.patchValue(actualite);
    this.details.clear();
    (actualite.details || []).forEach(d => this.details.push(this.fb.control(d)));

    this.showForm = true;
  }

  /** 🔹 Soumettre le formulaire */
  onSubmit() {
    console.log('Formulaire soumis', this.newsForm.value);

    if (this.newsForm.invalid) return;

    const formData = this.newsForm.value;

    if (this.editMode && this.currentId) {
      // ✅ Mise à jour
      this.actualiteAdminService.updateActualite(this.currentId, formData).subscribe({
        next: (res: any) => {
          this.loadActualites();
          this.resetForm();
          this.showMessage(res.message || 'Actualité mise à jour avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la mise à jour', 'error');
        },
      });
    } else {
      // ✅ Création
      this.actualiteAdminService.createActualite(formData).subscribe({
        next: (res: any) => {
          this.loadActualites();
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
      this.actualiteAdminService.deleteActualite(id).subscribe({
        next: (res: any) => {
          this.loadActualites();
          this.showMessage(res.message || 'Actualité supprimée avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la suppression', 'error');
        },
      });
    }
  }

  /** 🔹 Réinitialiser le formulaire */
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

  /** 🔹 Ouvrir la modale */
  openModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '65%',
      data: { actualite: this.actualites[index] },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('Modal fermée avec résultat :', result);
    });
  }

  /** 🔹 Message de succès / erreur */
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
