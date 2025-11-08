import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RessourceEtudiantService, RessourceResponse } from '../../services/ressource-etudiant-service';
import { TelechargementService } from '../../services/telechargement-service';
import { AuthAdminService } from '../../services/auth-admin-service';
import { ressourcesInterface } from '../../interfaces/ressourceInterface';

@Component({
  selector: 'app-ressource-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './ressource-etudiant.html',
  styleUrls: ['./ressource-etudiant.css'],
})
export class RessourceEtudiant {
  ressources: ressourcesInterface[] = [];
  totalPages = 0;
  currentPage = 1;
  total = 0;
  limit = 10;

  typeFilter = '';
  niveauFilter = '';
  matiereFilter = '';
  searchTerm = '';

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
    { value: 'histoire', label: 'Histoire économique' },
  ];

  constructor(
    private ressourceEtudiantService: RessourceEtudiantService,
    private telechargementService: TelechargementService,
    public authService: AuthAdminService
  ) {}

  ngOnInit(): void {
    this.loadRessources();
  }

  loadRessources(): void {
    this.ressourceEtudiantService
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
          // Supprimer les doublons au cas où
          const uniqueRessources = new Map<string, ressourcesInterface>();
          (response.ressources as any[]).forEach((r) => {
            uniqueRessources.set(r._id, {
              _id: r._id ?? '',
              titre: r.titre ?? '',
              description: r.description ?? '',
              type: r.type ?? '',
              niveau: r.niveau ?? '',
              matiere: r.matiere ?? '',
              auteur: r.auteur
                ? {
                    _id: r.auteur._id ?? '',
                    nom: r.auteur.nom ?? r.auteur.lastName ?? '',
                    prenom: r.auteur.prenom ?? r.auteur.firstName ?? '',
                  }
                : { _id: '', nom: '', prenom: '' },
              fichier: r.fichier ?? { nom: '', url: '', taille: 0, type: '' },
              dateCreation: r.dateCreation
                ? new Date(r.dateCreation)
                : r.createdAt
                ? new Date(r.createdAt)
                : new Date(),
              datePublication: r.datePublication ? new Date(r.datePublication) : undefined,
              tags: r.tags ?? [],
              estPublic: r.estPublic ?? true,
            });
          });
          this.ressources = Array.from(uniqueRessources.values());

          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.total = response.total;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des ressources:', error);
        },
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
}
