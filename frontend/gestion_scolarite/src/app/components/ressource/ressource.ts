import { Component } from '@angular/core';
import { RessourceResponse, RessourceService } from '../../services/ressource-service';
import { TelechargementService } from '../../services/telechargement-service';
import { AuthAdminService } from '../../services/auth-admin-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ressource as RessourceInterface } from '../../interfaces/ressourceInterface';

@Component({
  selector: 'app-ressource',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './ressource.html',
  styleUrl: './ressource.css'
})
export class Ressource {
  ressources: RessourceInterface[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  total: number = 0;
  limit: number = 10;

  // Filtres
  typeFilter: string = '';
  niveauFilter: string = '';
  matiereFilter: string = '';
  searchTerm: string = '';

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

  matieres = [
    { value: '', label: 'Toutes les matières' },
    { value: 'microeconomie', label: 'Microéconomie' },
    { value: 'macroeconomie', label: 'Macroéconomie' },
    { value: 'econometrie', label: 'Économétrie' },
    { value: 'statistiques', label: 'Statistiques' },
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'histoire', label: 'Histoire économique' }
  ];

  constructor(
    private ressourceService: RessourceService,
    private telechargementService: TelechargementService,
    public authService: AuthAdminService
  ) { }
  getFileIcon(type: string): string {
    switch (type) {
      case 'application/pdf':
        return 'fa fa-file-pdf';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'fa fa-file-word';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'fa fa-file-excel';
      case 'image/png':
      case 'image/jpeg':
        return 'fa fa-file-image';
      case 'text/plain':
        return 'fa fa-file-alt';
      default:
        return 'fa fa-file';
    }
  }
  ngOnInit(): void {
    this.loadRessources();
  }

  loadRessources(): void {
    this.ressourceService.getRessources(
      this.typeFilter,
      this.niveauFilter,
      this.matiereFilter,
      this.searchTerm,
      this.currentPage,
      this.limit
    ).subscribe({
      next: (response: RessourceResponse) => {
        this.ressources = response.ressources;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.total = response.total;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ressources:', error);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
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

  telechargerRessource(ressource: RessourceInterface): void {
    if (!this.authService.isAuthenticated()) {
      alert('Veuillez vous connecter pour télécharger des ressources.');
      return;
    }

    console.log('ID de ressource à télécharger:', ressource._id);
    console.log('Token trouvé dans localStorage:', localStorage.getItem('token')); // ← ajoute ici


    this.telechargementService.enregistrerTelechargement(ressource._id!)
      .subscribe({
        next: (response) => {
          console.log('Réponse du backend:', response);

          // ✅ Utiliser directement le lien complet
          const link = document.createElement('a');
          link.href = response.fichierUrl;
          link.download = ressource.fichier?.nom || 'fichier';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          console.log('Téléchargement lancé avec succès.');
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement:', error);
          alert('Erreur lors du téléchargement.');
        }
      });
  }

  getTypeLabel(type: string): string {
    const typeObj = this.types.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getNiveauLabel(niveau: string): string {
    const niveauObj = this.niveaux.find(n => n.value === niveau);
    return niveauObj ? niveauObj.label : niveau;
  }

  getMatiereLabel(matiere: string): string {
    const matiereObj = this.matieres.find(m => m.value === matiere);
    return matiereObj ? matiereObj.label : matiere;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

