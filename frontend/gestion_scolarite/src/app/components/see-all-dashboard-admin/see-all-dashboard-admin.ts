import { Component, inject } from '@angular/core';
import { SeeAllDashboardAdminService, Dashboard } from '../../services/see-all-dashboard-admin-service';
import { Dialog } from '@angular/cdk/dialog';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-see-all-dashboard-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './see-all-dashboard-admin.html',
  styleUrls: ['./see-all-dashboard-admin.css']
})
export class SeeAllDashboardAdmin {
  readonly dialog = inject(Dialog);

  seeAllDashboards: Dashboard[] = [];
  loading = true;

  successMessage = '';
  errorMessage = '';

  dashboardForm!: FormGroup;
  showForm = false;
  editMode = false;
  currentId: string | null = null;

  constructor(
    private seeAllDashboardAdminService: SeeAllDashboardAdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDashboards();
  }

  /** 🔹 Initialisation du formulaire */
  initForm() {
    this.dashboardForm = this.fb.group({
      titre: ['', Validators.required],
      contenu: ['', Validators.required],
      icon: [''],
      actionText: ['', Validators.required],
      sousTitre: [''],
      modalDescription: [''],
      details: this.fb.array([]),
      status: [''],
    });
  }

  get details(): FormArray {
    return this.dashboardForm.get('details') as FormArray;
  }

  addDetail() {
    this.details.push(this.fb.control(''));
  }

  removeDetail(i: number) {
    this.details.removeAt(i);
  }

  /** 🔹 Charger tous les dashboards */
  loadDashboards() {
    this.loading = true;
    this.seeAllDashboardAdminService.getAllSeeAllDashboards().subscribe({
      next: (res: any) => {
        this.seeAllDashboards = Array.isArray(res.data) ? res.data : res;
        this.loading = false;
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des dashboards', 'error');
        this.loading = false;
      },
    });
  }

  /** 🔹 Ajouter un nouveau dashboard */
  newDashboard() {
    this.resetForm();
    this.showForm = true;
    this.editMode = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  /** 🔹 Modifier un dashboard existant */
  editDashboard(dashboard: Dashboard) {
    this.editMode = true;
    this.currentId = (dashboard as any)._id;

    this.dashboardForm.patchValue(dashboard);
    this.details.clear();
    (dashboard.details || []).forEach(d => this.details.push(this.fb.control(d)));

    this.showForm = true;
  }

  /** 🔹 Soumettre le formulaire (ajout ou mise à jour) */
  onSubmit() {
    if (this.dashboardForm.invalid) return;
    const formData = this.dashboardForm.value;

    if (this.editMode && this.currentId) {
      this.seeAllDashboardAdminService.updateSeeAllDashboard(this.currentId, formData).subscribe({
        next: (res: any) => {
          this.loadDashboards();
          this.resetForm();
          this.showMessage(res.message || 'Dashboard mis à jour avec succès', 'success');
        },
        error: (err) => this.showMessage(err.error?.message || 'Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.seeAllDashboardAdminService.createSeeAllDashboard(formData).subscribe({
        next: (res: any) => {
          this.loadDashboards();
          this.resetForm();
          this.showMessage(res.message || 'Dashboard ajouté avec succès', 'success');
        },
        error: (err) => this.showMessage(err.error?.message || 'Erreur lors de la création', 'error')
      });
    }
  }

  /** 🔹 Supprimer un dashboard */
  deleteDashboard(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce dashboard ?')) {
      this.seeAllDashboardAdminService.deleteSeeAllDashboard(id).subscribe({
        next: (res: any) => {
          this.loadDashboards();
          this.showMessage(res.message || 'Dashboard supprimé avec succès', 'success');
        },
        error: (err) => this.showMessage(err.error?.message || 'Erreur lors de la suppression', 'error')
      });
    }
  }

  /** 🔹 Réinitialiser et cacher le formulaire */
  resetForm() {
    this.dashboardForm.reset();
    this.details.clear();
    this.showForm = false;
    this.editMode = false;
    this.currentId = null;
  }

  /** 🔹 Ouvrir la modale */
  openModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '75%',
      data: { dashboard: this.seeAllDashboards[index] },
    });

    dialogRef.closed.subscribe(result => {
      console.log('Modal fermée avec résultat :', result);
    });
  }

  /** 🔹 Afficher messages temporaires */
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