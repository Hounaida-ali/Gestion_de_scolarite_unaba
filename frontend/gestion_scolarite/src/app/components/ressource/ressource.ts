  import { Component, ElementRef, Input, ViewChild } from '@angular/core';
  import { CommonModule, DatePipe } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { RessourceService, RessourceResponse } from '../../services/ressource-service';
  import { TelechargementService } from '../../services/telechargement-service';
  import { AuthAdminService } from '../../services/auth-admin-service';
  import { ressourcesInterface } from '../../interfaces/ressourceInterface';

  @Component({
    selector: 'app-ressource',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './ressource.html',
    styleUrls: ['./ressource.css'],
  })
  export class RessourceComponent {
    ressources: ressourcesInterface[] = [];
    totalPages = 0;
    currentPage = 1;
    total = 0;
    limit = 10;

    errorMessage: string = '';
    successMessage: string = '';

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    currentFileName?: string;

    // Filtres
    typeFilter = '';
    niveauFilter = '';
    matiereFilter = '';
    searchTerm = '';

    // Options de filtre
    types = [
      { value: '', label: 'Tous les types' },
      { value: 'cours', label: 'Cours' },
      { value: 'td', label: 'Travaux Dirigés' },
      { value: 'tp', label: 'Travaux Pratiques' },
    ];

    niveaux = [
      { value: '', label: 'Tous les niveaux' },
      { value: 'licence1', label: 'Licence 1' },
      { value: 'licence2', label: 'Licence 2' },
      { value: 'licence3', label: 'Licence 3' },
    ];

    matieres: { value: string; label: string }[] = [{ value: '', label: 'Toutes les matières' }];

    // Formulaire
    showRessourceForm = false;
    selectedRessource: any = null;
    selectedFile: File | null = null;

    constructor(
      private ressourceService: RessourceService,
      private telechargementService: TelechargementService,
      public authService: AuthAdminService
    ) {}

    ngOnInit(): void {
      this.matiereFilter = localStorage.getItem('matiereFilter') || '';
      this.loadRessources();
    }

    // Chargement des ressources
    loadRessources(): void {
      this.ressourceService
        .getRessources(
          this.typeFilter,
          this.niveauFilter,
          this.matiereFilter,
          this.searchTerm,
          this.currentPage,
          this.limit
        )
        .subscribe({
          next: (response: RessourceResponse) => {
            this.ressources = response.ressources ?? [];
            this.totalPages = response.totalPages;
            this.currentPage = response.currentPage;
            this.total = response.total;

            // 🔹 AJOUT → Harmoniser les champs auteur
        this.ressources = this.ressources.map((r: any) => ({
          ...r,
          auteur: r.auteur
            ? {
                _id: r.auteur._id ?? '',
                nom: r.auteur.nom ?? r.auteur.lastName ?? '',
                prenom: r.auteur.prenom ?? r.auteur.firstName ?? '',
              }
            : { _id: '', nom: '', prenom: '' },
        }));
        
            const uniqueMatieres = Array.from(
              new Set(this.ressources.map((r) => r.matiere).filter(Boolean))
            );

            this.matieres = [
              { value: '', label: 'Toutes les matières' },
              ...uniqueMatieres.map((m) => ({ value: m, label: this.capitalize(m) })),
            ];
          },
          error: (error) => {
            console.error('Erreur lors du chargement des ressources:', error);
            this.showMessage('Erreur lors du chargement des ressources', 'error');
          },
        });
    }

    // Pagination et filtres
    onFilterChange(): void {
      this.currentPage = 1;
      localStorage.setItem('matiereFilter', this.matiereFilter);
      this.loadRessources();
    }

    onSearch(): void {
      this.currentPage = 1;
      this.loadRessources();
    }

    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadRessources();
    }

    // Téléchargement
    telechargerRessource(ressource: ressourcesInterface): void {
      if (!this.authService.isAuthenticated()) {
        alert('Veuillez vous connecter pour télécharger des ressources.');
        return;
      }

      this.telechargementService.enregistrerTelechargement(ressource._id!).subscribe({
        next: (response) => {
          const link = document.createElement('a');
          link.href = response.fichierUrl;
          link.download = ressource.fichier?.nom || 'fichier';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement:', error);
          alert('Erreur lors du téléchargement.');
        },
      });
    }

    // Utilitaires
    getTypeLabel(type: string): string {
      return this.types.find((t) => t.value === type)?.label || type;
    }

    getNiveauLabel(niveau: string): string {
      return this.niveaux.find((n) => n.value === niveau)?.label || niveau;
    }

    getMatiereLabel(matiere: string): string {
      return this.matieres.find((m) => m.value === matiere)?.label || matiere;
    }

    formatFileSize(bytes: number): string {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private capitalize(str: string): string {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // --- FORMULAIRE ---
    newRessource(): void {
      this.selectedRessource = {
        titre: '',
        description: '',
        type: '',
        niveau: '',
        matiere: '',
        tags: '',
      };
      this.selectedFile = null;
      this.showRessourceForm = true;
    }

    editRessource(ressource: ressourcesInterface): void {
      this.selectedRessource = { ...ressource };
      this.selectedFile = null;
      this.showRessourceForm = true;
    }

    resetForm(): void {
      this.selectedRessource = null;
      this.selectedFile = null;
      this.showRessourceForm = false;
    }

    // 🔹 Sélection d’un fichier
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        console.log('✅ Fichier sélectionné :', file.name);
      }
    }
    onFakeFileClick() {
      if (this.selectedRessource._id) {
        alert('Ce champ est non modifiable lors de la mise à jour.');
      } else {
        // déclenche l’input réel pour ajouter un fichier
        this.fileInput.nativeElement.click();
      }
    }

    // --- SAUVEGARDE ---
    saveRessource(): void {
      if (!this.selectedRessource) return;

      const isUpdate = !!this.selectedRessource._id;

      if (isUpdate) {
        // 🔹 MISE À JOUR (sans changer le fichier)
        const payload = {
          titre: this.selectedRessource.titre,
          description: this.selectedRessource.description,
          type: this.selectedRessource.type,
          niveau: this.selectedRessource.niveau,
          matiere: this.selectedRessource.matiere,
          tags: this.selectedRessource.tags || '',
          // Ne pas inclure le fichier ici si on ne change pas
        };

        // On garde le fichier existant côté backend, pas besoin de l'envoyer
        this.ressourceService.updateRessourceJSON(this.selectedRessource._id, payload).subscribe({
          next: (res: any) => {
            console.log('Ressource mise à jour avec succès', res);
            const index = this.ressources.findIndex((r) => r._id === this.selectedRessource._id);
            if (index !== -1) this.ressources[index] = res.ressource ?? res;

            this.showMessage('Ressource mise à jour avec succès', 'success');
            this.resetForm();
            this.loadRessources();
          },
          error: (err: any) => {
            console.error('Erreur update ressource', err);
            this.showMessage(
              err?.error?.message || 'Erreur lors de la mise à jour de la ressource',
              'error'
            );
          },
        });
      } else {
        // 🔹 CRÉATION (upload puis création JSON)
        if (!this.selectedFile) {
          this.showMessage('Veuillez sélectionner un fichier avant de créer la ressource', 'error');
          return;
        }

        this.ressourceService.uploadFile(this.selectedFile).subscribe({
          next: (res: any) => {
            console.log('Upload réussi', res);

            const fichierMetadata = res.file;

            const payload = {
              titre: this.selectedRessource.titre,
              description: this.selectedRessource.description,
              type: this.selectedRessource.type,
              niveau: this.selectedRessource.niveau,
              matiere: this.selectedRessource.matiere,
              tags: this.selectedRessource.tags,
              fichier: fichierMetadata,
            };

            this.ressourceService.createRessourceJSON(payload).subscribe({
              next: (res: any) => {
                console.log('Ressource créée avec succès', res);
                this.ressources.push(res.ressource ?? res);
                this.showMessage('Ressource créée avec succès', 'success');
                this.resetForm();
                this.loadRessources();
              },
              error: (err: any) => {
                console.error('Erreur création ressource', err);
                this.showMessage(
                  err?.error?.message || 'Erreur lors de la création de la ressource',
                  'error'
                );
              },
            });
          },
          error: (err: any) => {
            console.error('Erreur upload fichier', err);
            this.showMessage('Erreur lors de l’upload du fichier', 'error');
          },
        });
      }
    }

    // --- SUPPRESSION ---
    deleteRessource(ressource: any): void {
      if (!ressource._id) return;
      if (!confirm(`Voulez-vous vraiment supprimer la ressource "${ressource.titre}" ?`)) return;

      this.ressourceService.deleteRessource(ressource._id).subscribe({
        next: (res: any) => {
          const message = res?.message || 'Ressource supprimée avec succès';
          this.ressources = this.ressources.filter((r) => r._id !== ressource._id);
          this.showMessage(message, 'success');
        },
        error: (err: any) => {
          const message = err?.error?.message || 'Erreur lors de la suppression de la ressource';
          this.showMessage(message, 'error');
        },
      });
    }

    // --- MESSAGES ---
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
