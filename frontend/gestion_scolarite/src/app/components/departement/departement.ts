import { Component } from '@angular/core';
import { DepartementService } from '../../services/departement-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-departement',
  imports: [CommonModule, FormsModule, DatePipe,RouterLink],
  templateUrl: './departement.html',
  styleUrl: './departement.css',
})
export class Departement {
  departements: any[] = [];
  selectedDepartement: any = null;
  showDepartementForm = false;

  successMessage = '';
  errorMessage = '';

  constructor(private departementService: DepartementService) {}

  ngOnInit(): void {
    this.loadDepartements();
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

  newDepartement(): void {
    this.selectedDepartement = {
      _id: '',
      nom: '',
      departement: '',
      description: '',
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

    // ✅ Vérification des champs requis
    if (!this.selectedDepartement.nom || !this.selectedDepartement.departement) {
      this.showMessage('Veuillez remplir les champs obligatoires.', 'error');
      return;
    }

    const payload: any = {
      nom: this.selectedDepartement.nom.trim(),
      departement: this.selectedDepartement.departement.trim(),
      description: this.selectedDepartement.description?.trim() || '',
    };

    const isUpdate = !!this.selectedDepartement._id;

    // ✅ Cas 1 : Mise à jour d’un département existant
    if (isUpdate) {
      this.departementService.update(this.selectedDepartement._id, payload).subscribe({
        next: (res: any) => {
          const message = res?.message || 'Département mis à jour avec succès';
          const updatedDep = res?.data ?? res;

          // Remplacer le département modifié dans la liste
          const index = this.departements.findIndex((d) => d._id === this.selectedDepartement._id);
          if (index !== -1) this.departements[index] = updatedDep;

          this.showMessage(message, 'success');
          this.resetForm();
        },
        error: (err) => {
          const message = err?.error?.message || 'Erreur lors de la mise à jour du département.';
          this.showMessage(message, 'error');
        },
      });

      // ✅ Cas 2 : Création d’un nouveau département
    } else {
      this.departementService.create(payload).subscribe({
        next: (res: any) => {
          const message = res?.message || 'Département ajouté avec succès';
          const newDep = res?.data ?? res;

          this.departements.push(newDep);
          this.showMessage(message, 'success');
          this.resetForm();
        },
        error: (err) => {
          const message = err?.error?.message || 'Erreur lors de l’ajout du département.';
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
