import { Component } from '@angular/core';
import { FaculteService } from '../../services/faculte-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

export interface Faculte {
  _id?: string;
  nomFaculte: string;
  adresse?: string;
}
@Component({
  selector: 'app-faculte',
  imports: [CommonModule, FormsModule],
  templateUrl: './faculte.html',
  styleUrl: './faculte.css',
})
export class FaculteComponent {
  facultes: Faculte[] = [];
  faculteSelected: Faculte | null = null;
  showFaculteForm = false;
  successMessage = '';
  errorMessage = '';

  constructor(private faculteService: FaculteService) {}

  ngOnInit() {
    this.loadFacultes();
  }

  loadFacultes() {
    this.faculteService.getAll().subscribe({
      next: (data) => (this.facultes = data),
      error: () => this.showMessage('Erreur lors du chargement.', 'error'),
    });
  }

  newFaculte() {
    this.faculteSelected = {
      nomFaculte: '',
      adresse: '',
    };
    this.showFaculteForm = true;
  }

  saveFaculte() {
    if (!this.faculteSelected?.nomFaculte.trim()) {
      this.showMessage('Le nom de la faculté est obligatoire.', 'error');
      return;
    }

    const payload = {
      nomFaculte: this.faculteSelected.nomFaculte.trim(),
      adresse: this.faculteSelected.adresse?.trim() || '',
    };

    const isUpdate = !!this.faculteSelected._id;

    if (isUpdate) {
      // 🔹 Mise à jour
      this.faculteService.update(this.faculteSelected._id!, payload).subscribe({
        next: (res: any) => {
          const message = res?.message || 'Faculté mise à jour avec succès';

          // 🔥 vérifier si le backend renvoie un message d'erreur en statut 200
          if (
            message.toLowerCase().includes('veuillez') ||
            message.toLowerCase().includes('obligatoire')
          ) {
            this.showMessage(message, 'error');
            return;
          }

          const updatedFac = res?.data ?? res;

          const index = this.facultes.findIndex((f) => f._id === this.faculteSelected!._id);
          if (index !== -1) {
            this.facultes[index] = { ...updatedFac };
          }

          this.showMessage(message, 'success');
          this.resetForm();
        },

        error: (err) => {
          const message = err?.error?.message || 'Erreur lors de la mise à jour.';
          this.showMessage(message, 'error');
        },
      });
    } else {
      // 🔹 Création
      this.faculteService.create(payload).subscribe({
        next: (res: any) => {
          const message = res?.message || 'Faculté ajoutée avec succès';
          const newFac = res?.data ?? res;

          this.facultes.push({ ...newFac });

          this.showMessage(message, 'success');
          this.resetForm();
        },
        error: (err) => {
          const message = err?.error?.message || 'Erreur lors de la création.';
          this.showMessage(message, 'error');
        },
      });
    }
  }

  editFaculte(fac: Faculte) {
    this.faculteSelected = { ...fac };
    this.showFaculteForm = true;
  }

  deleteFaculte(fac: Faculte) {
    if (!fac._id) return;
    if (!confirm(`Supprimer la faculté "${fac.nomFaculte}" ?`)) return;

    this.faculteService.delete(fac._id).subscribe({
      next: (res: any) => {
        const message = res?.message || 'Faculté supprimée avec succès';

        this.facultes = this.facultes.filter((f) => f._id !== fac._id);

        this.showMessage(message, 'success');
      },
      error: (err) => {
        const message = err?.error?.message || 'Erreur lors de la suppression.';
        this.showMessage(message, 'error');
      },
    });
  }

  resetForm() {
    this.faculteSelected = null;
    this.showFaculteForm = false;
  }

  showMessage(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ''), 2500);
    } else {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = ''), 2500);
    }
  }
}
