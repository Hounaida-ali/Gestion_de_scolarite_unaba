import { Component } from '@angular/core';
import { DepartementService } from '../../services/departement-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaculteService } from '../../services/faculte-service';

@Component({
  selector: 'app-departement',
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './departement.html',
  styleUrl: './departement.css',
})
export class Departement {
  departements: any[] = [];
  facultes: any[] = [];
  selectedDepartement: any = null;
  showDepartementForm = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private departementService: DepartementService,
    private faculteService: FaculteService
  ) {}

  ngOnInit(): void {
    this.loadDepartements();
    this.loadFacultes();
  }

  // 🔹 Charger tous les départements
  loadDepartements(): void {
    this.departementService.getAll().subscribe({
      next: (data) => {
        this.departements = data;
      },
      error: (err) => {
        const message = err?.error?.message || 'Erreur lors du chargement des départements.';
        this.showMessage(message, 'error');
      },
    });
  }
  loadFacultes() {
    this.faculteService.getAll().subscribe({
      next: (res) => (this.facultes = res),
      error: () => console.error('Erreur lors du chargement des facultés'),
    });
  }
  newDepartement(): void {
    this.selectedDepartement = {
      _id: '',
      nom: '',
      departement: '',
      description: '',
      faculteNom: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.successMessage = '';
    this.errorMessage = '';
    this.showDepartementForm = true;
  }

  // ajouter ou modifier un departement
  saveDepartement(): void {
    if (!this.selectedDepartement) return;

    // ✅ Vérification des champs requis avant envoi
    if (
      !this.selectedDepartement.nom ||
      !this.selectedDepartement.departement ||
      !this.selectedDepartement.faculteNom
    ) {
      this.showMessage(
        'Le nom, le code du département et le nom de la faculté sont obligatoires.',
        'error'
      );
      return;
    }

    // Récupérer le nom de la faculté (string ou objet peu importe)
    let facNom: string;
    if (typeof this.selectedDepartement.faculteNom === 'string') {
      facNom = this.selectedDepartement.faculteNom.trim();
    } else {
      facNom = this.selectedDepartement.faculteNom?.nomFaculte?.trim() || '';
    }

    const payload: any = {
      nom: this.selectedDepartement.nom.trim(),
      departement: this.selectedDepartement.departement.trim(),
      description: this.selectedDepartement.description?.trim() || '',
      faculteNom: facNom,
    };

    const isUpdate = !!this.selectedDepartement._id;

    if (isUpdate) {
      // Mise à jour
      this.departementService.update(this.selectedDepartement._id, payload).subscribe({
        next: (res: any) => {
          const message = res?.message ?? 'Département mis à jour avec succès';
          const updatedDep = res?.data ?? res;

          // Si le backend dit que c’est un échec malgré le status 200
          if (res?.success === false) {
            this.showMessage(message, 'error'); // ⚠️ message d’erreur
          } else {
            const index = this.departements.findIndex(
              (d) => d._id === this.selectedDepartement._id
            );
            if (index !== -1) this.departements[index] = updatedDep;
            this.showMessage(message, 'success'); // ✅ message succès
            this.resetForm();
          }
        },
      });
    } else {
      // Création
      this.departementService.create(payload).subscribe({
        next: (res: any) => {
          const message = res?.message ?? 'Département ajouté avec succès';
          const newDep = res?.data ?? res;

          this.departements.push(newDep);
          this.showMessage(message, 'success');
          this.resetForm();
        },
        error: (err: any) => {
          const message = err?.error?.message ?? 'Erreur lors de l’ajout du département.';
          this.showMessage(message, 'error');
        },
      });
    }
  }

  // 🔹 Édition
  editDepartement(dep: any): void {
    this.selectedDepartement = { ...dep };
    this.showDepartementForm = true;
  }

  // 🔹 Suppression
  deleteDepartement(dep: any): void {
    if (!dep._id) return;
    if (!confirm(`Supprimer le département "${dep.nom}" ?`)) return;

    this.departementService.delete(dep._id).subscribe({
      next: (res: any) => {
        const message = res?.message || 'Département supprimé avec succès';
        this.departements = this.departements.filter((d) => d._id !== dep._id);
        this.showMessage(message, 'success');
      },
      error: (err) => {
        const message = err?.error?.message || 'Erreur lors de la suppression.';
        this.showMessage(message, 'error');
      },
    });
  }

  // 🔹 Réinitialiser le formulaire
  resetForm(): void {
    this.selectedDepartement = null;
    this.showDepartementForm = false;
  }

  // 🔹 Afficher message temporaire (succès / erreur)
  showMessage(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ''), 3000);
    } else {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }
}
