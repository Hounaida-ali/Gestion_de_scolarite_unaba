import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QuickAccesAdminService, AccesRapide } from '../../services/quick-acces-admin-service';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { Dialog } from '@angular/cdk/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-quick-acces-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quick-acces-admin.html',
  styleUrls: ['./quick-acces-admin.css']
})
export class QuickAccesAdmin {
  readonly dialog = inject(Dialog);

  accesRapides: AccesRapide[] = [];
  loading = true;

  successMessage = '';
  errorMessage = '';

  accessForm!: FormGroup;
  showForm = false;
  editMode = false;
  currentId: string | null = null;

  constructor(
    private quickAccesAdminService: QuickAccesAdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAccesses();
  }

  /** 🔹 Initialisation du formulaire */
  initForm() {
    this.accessForm = this.fb.group({
      titre: ['', Validators.required],
      contenu: ['', Validators.required],
      icon: ['', Validators.required],
      actionText: ['', Validators.required],
      sousTitre: [''],
      modalDescription: [''],
      details: this.fb.array([]),
      status: [''],
    });
  }

  get details(): FormArray {
    return this.accessForm.get('details') as FormArray;
  }

  addDetail() {
    this.details.push(this.fb.control(''));
  }

  removeDetail(i: number) {
    this.details.removeAt(i);
  }

  /** 🔹 Charger tous les accès rapides */
  loadAccesses() {
    this.loading = true;
    this.quickAccesAdminService.getAccesRapides().subscribe({
      next: (res: any) => {
        this.accesRapides = Array.isArray(res.data) ? res.data : res;
        this.loading = false;
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des accès rapides', 'error');
        this.loading = false;
      },
    });
  }

  /** 🔹 Cliquer sur “Ajouter un accès rapide” */
  newAccess() {
    this.resetForm();
    this.showForm = true;
    this.editMode = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  /** 🔹 Cliquer sur “Modifier” */
  editAccess(acces: AccesRapide) {
    this.editMode = true;
    this.currentId = (acces as any)._id;

    this.accessForm.patchValue(acces);
    this.details.clear();
    (acces.details || []).forEach((d) => this.details.push(this.fb.control(d)));

    this.showForm = true;
  }

  /** 🔹 Soumettre le formulaire */
  onSubmit() {
    console.log('Form submitted', this.accessForm.value);
    
    if (this.accessForm.invalid) return;

    const formData = this.accessForm.value;

    if (this.editMode && this.currentId) {
      // ✅ Mise à jour
      this.quickAccesAdminService.updateAccesRapide(this.currentId, formData).subscribe({
        next: (res: any) => {
          this.loadAccesses();
          this.resetForm();
          this.showMessage(res.message || 'Accès rapide mis à jour avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la mise à jour', 'error');
        },
      });
    } else {
      // ✅ Création
      this.quickAccesAdminService.createAccesRapide(formData).subscribe({
        next: (res: any) => {
          this.loadAccesses();
          this.resetForm();
          this.showMessage(res.message || 'Accès rapide ajouté avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la création', 'error');
        },
      });
    }
  }

  /** 🔹 Supprimer un accès rapide */
  deleteAccess(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cet accès rapide ?')) {
      this.quickAccesAdminService.deleteAccesRapide(id).subscribe({
        next: (res: any) => {
          this.loadAccesses();
          this.showMessage(res.message || 'Accès rapide supprimé avec succès', 'success');
        },
        error: (err) => {
          this.showMessage(err.error?.message || 'Erreur lors de la suppression', 'error');
        },
      });
    }
  }

  /** 🔹 Réinitialiser et cacher le formulaire */
  resetForm() {
    this.accessForm.reset();
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
      data: { acces: this.accesRapides[index] },
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
