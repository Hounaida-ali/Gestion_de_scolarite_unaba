import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { DialogModal } from '../dialog-modal/dialog-modal';
import { HomeAdminService, Dashboard } from '../../services/home-admin-service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.css']
})
export class HomeAdmin implements OnInit {
  readonly dialog = inject(Dialog);

  homeDashboards: Dashboard[] = [];
  loading = true;

  errorMessage: string = '';
  successMessage: string = '';

  dashboardForm!: FormGroup;
  editMode = false;
  currentId: string | null = null;
  showForm = false; // ← formulaire caché par défaut

  constructor(
    private homeAdminService: HomeAdminService,
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
      label: ['', Validators.required],
      labelIcon: ['', Validators.required],
      icon: ['', Validators.required],
      actionText: ['', Validators.required],
      sousTitre: [''],
      modalDescription: [''],
      details: this.fb.array([]),
      status: ['']
    });
  }

  get details(): FormArray {
    return this.dashboardForm.get('details') as FormArray;
  }

  addDetail() {
    this.details.push(this.fb.control(''));
  }

  removeDetail(index: number) {
    this.details.removeAt(index);
  }

  /** 🔹 Cliquer sur “Ajouter un dashboard” */
  newDashboard() {
    this.editMode = false;
    this.currentId = null;
    this.dashboardForm.reset();
    this.details.clear();
    this.showForm = true; // ← formulaire devient visible
    this.successMessage = '';
    this.errorMessage = '';
  }

  /** 🔹 Charger les dashboards */
  loadDashboards() {
    this.homeAdminService.getAllDashboards().subscribe({
      next: (data: any) => {
        this.homeDashboards = Array.isArray(data.data) ? data.data : data;
        this.loading = false;
      },
      error: (err) => {
        this.showMessage("Erreur lors du chargement des dashboards", 'error');
        this.loading = false;
      },
    });
  }

  /** 🔹 Afficher message temporaire */
  showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), duration);
    } else {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), duration);
    }
  }

  /** 🔹 Soumission du formulaire (création / édition) */
  onSubmit() {
    if (this.dashboardForm.invalid) return;

    const formData = this.dashboardForm.value;

    if (this.editMode && this.currentId) {
      // Mise à jour
      this.homeAdminService.updateDashboard(this.currentId, formData).subscribe({
        next: (res: any) => {
          this.loadDashboards();
          this.resetForm();
          this.showMessage(res.message || 'Dashboard mis à jour avec succès !', 'success');
        },
        error: (err) => this.showMessage(err.error?.message || 'Erreur lors de la mise à jour', 'error')
      });
    } else {
      // Création
      this.homeAdminService.createDashboard(formData).subscribe({
        next: (res: any) => {
          this.loadDashboards();
          this.resetForm();
          this.showMessage(res.message || 'Dashboard créé avec succès !', 'success');
        },
        error: (err) => this.showMessage(err.error?.message || 'Erreur lors de la création', 'error')
      });
    }
  }

  /** 🔹 Cliquer sur “Modifier” */
  editDashboard(dashboard: Dashboard) {
    this.editMode = true;
    this.currentId = (dashboard as any)._id;

    this.dashboardForm.patchValue(dashboard);
    this.details.clear();
    (dashboard.details || []).forEach(detail => this.details.push(this.fb.control(detail)));

    this.showForm = true; // ← formulaire devient visible
  }

  /** 🔹 Réinitialiser le formulaire et le cacher */
  resetForm() {
    this.editMode = false;
    this.currentId = null;
    this.dashboardForm.reset();
    this.details.clear();
    this.showForm = false; // ← formulaire caché
    this.successMessage = '';
    this.errorMessage = '';
  }

  /** 🔹 Suppression */
  deleteDashboard(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce dashboard ?')) {
      this.homeAdminService.deleteDashboard(id).subscribe({
        next: (res: any) => {
          this.loadDashboards();
          this.showMessage(res.message || 'Dashboard supprimé avec succès !', 'success');
        },
        error: (err) => this.showMessage(err.error?.message || 'Erreur lors de la suppression', 'error')
      });
    }
  }
cancelEdit() {
  this.resetForm();
}

  /** 🔹 Ouvrir la modale */
  openModal(index: number): void {
    const dialogRef = this.dialog.open(DialogModal, {
      width: '75%',
      data: { dashboard: this.homeDashboards[index] },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('Modal fermée avec résultat :', result);
    });
  }
}
