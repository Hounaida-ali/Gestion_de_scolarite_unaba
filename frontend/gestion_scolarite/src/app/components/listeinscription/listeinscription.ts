import { Component } from '@angular/core';
import { EtudiantService } from '../../services/etudiant-service';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatistiquesGraphiques } from '../statistiques-graphiques/statistiques-graphiques';
import { EnseignantService } from '../../services/enseignant-service';

@Component({
  selector: 'app-listeinscription',
  imports: [CommonModule, RouterModule, FormsModule,StatistiquesGraphiques],
  templateUrl: './listeinscription.html',
  styleUrl: './listeinscription.css',
  standalone: true,
})
export class Listeinscription {
etudiants: Etudiant[] = [];
  etudiantsFiltres: Etudiant[] = [];
  chargement: boolean = true;
  erreur: string = '';

  enseignants: any[] = [];
  // Filtres
  filtreStatut: string = 'tous';
  filtreDepartement: string = 'tous';
  filtreRecherche: string = '';

  constructor(private etudiantService: EtudiantService, private router: Router, private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.chargerEtudiants();
    this.chargerEnseignants();
  }

  chargerEtudiants(): void {
    this.chargement = true;
    this.etudiantService.getAllEtudiants().subscribe({
      next: (etudiants: Etudiant[]) => { // TYPAGE EXPLICITE
        this.etudiants = etudiants;
        this.etudiantsFiltres = etudiants;
        this.chargement = false;
      },
      error: (error: any) => { // TYPAGE EXPLICITE
        console.error('Erreur chargement étudiants:', error);
        this.erreur = 'Erreur lors du chargement des inscriptions';
        this.chargement = false;
      }
    });
  }

  // Méthodes de filtrage
  appliquerFiltres(): void {
    this.etudiantsFiltres = this.etudiants.filter(etudiant => {
      // Filtre par statut
      const matchStatut = this.filtreStatut === 'tous' || etudiant.statut === this.filtreStatut;
      
      // Filtre par département
      const matchDepartement = this.filtreDepartement === 'tous' || etudiant.departement === this.filtreDepartement;
      
      // Filtre par recherche (nom, prénom, email)
      const recherche = this.filtreRecherche.toLowerCase();
      const matchRecherche = !this.filtreRecherche || 
        etudiant.nom.toLowerCase().includes(recherche) ||
        etudiant.prenom.toLowerCase().includes(recherche) ||
        etudiant.email.toLowerCase().includes(recherche) ||
        (etudiant.idProvisoire && etudiant.idProvisoire.toLowerCase().includes(recherche));

      return matchStatut && matchDepartement && matchRecherche;
    });
  }

  onFiltreChange(): void {
    this.appliquerFiltres();
  }

  // Méthodes helper pour les labels
  getFormationLabel(formationValue: string | undefined): string {
    if (!formationValue) return 'Non spécifié';
    const formations: { [key: string]: string } = {
      'informatique': 'Licence Informatique',
      'gestion': 'Licence Gestion',
      'droit': 'Licence Droit',
      'psychologie': 'Licence Psychologie',
      'master-info': 'Master Informatique',
      'master-gestion': 'Master Management'
    };
    return formations[formationValue] || formationValue;
  }

  getModeFormationLabel(modeValue: string | undefined): string {
    if (!modeValue) return 'Non spécifié';
    const modes: { [key: string]: string } = {
      'presentiel': 'Présentiel',
      'en-ligne': 'En ligne'
    };
    return modes[modeValue] || modeValue;
  }

  getDepartementLabel(departementValue: string | undefined): string {
    if (!departementValue) return 'Non spécifié';
    const departements: { [key: string]: string } = {
      'économie': 'Économie',
      'droit': 'Droit',
      'gestion': 'Gestion'
    };
    return departements[departementValue] || departementValue;
  }

  getNiveauEtudesLabel(niveauValue: string | undefined): string {
    if (!niveauValue) return 'Non spécifié';
    const niveaux: { [key: string]: string } = {
      'bac': 'Baccalauréat',
      'bac1': 'Bac+1',
      'bac2': 'Bac+2',
      'bac3': 'Bac+3',
      'bac4': 'Bac+4',
      'bac5': 'Bac+5'
    };
    return niveaux[niveauValue] || niveauValue;
  }

  getStatutLabel(statutValue: string | undefined): string {
    if (!statutValue) return 'Statut inconnu';
    const statuts: { [key: string]: string } = {
      'en-attente': 'En attente',
      'valide': 'Validé',
      'rejete': 'Rejeté',
      'paye': 'Payé',
      'confirme': 'Confirmé'
    };
    return statuts[statutValue] || statutValue;
  }

  getStatutClass(statut: string | undefined): string {
    if (!statut) return 'statut-inconnu';
    const classes: { [key: string]: string } = {
      'en-attente': 'statut-attente',
      'valide': 'statut-valide',
      'rejete': 'statut-rejete',
      'paye': 'statut-paye',
      'confirme': 'statut-confirme'
    };
    return classes[statut] || 'statut-inconnu';
  }

  formaterDate(date: string | Date | undefined): string {
    if (!date) return 'Non définie';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDocumentsLabels(documents: string[] | undefined): string {
    if (!documents || documents.length === 0) return 'Aucun document';
    
    const labels: { [key: string]: string } = {
      'cv': 'Curriculum Vitae',
      'lettre-motivation': 'Lettre de motivation',
      'releves-notes': 'Relevés de notes',
      'diplome': 'Copie du diplôme'
    };
    
    return documents.map(doc => labels[doc] || doc).join(', ');
  }

  // Méthode pour exporter en CSV
  exporterCSV(): void {
    const headers = ['ID Provisoire', 'Nom complet', 'Email', 'Téléphone', 'Département', 'Formation', 'Niveau', 'Statut', 'Date inscription'];
    const csvData = this.etudiantsFiltres.map(etudiant => [
      etudiant.idProvisoire || 'N/A',
      `${etudiant.prenom} ${etudiant.nom}`,
      etudiant.email,
      etudiant.telephone,
      this.getDepartementLabel(etudiant.departement),
      `${this.getFormationLabel(etudiant.formation)} - ${this.getModeFormationLabel(etudiant.modeFormation)}`,
      this.getNiveauEtudesLabel(etudiant.niveau),
      this.getStatutLabel(etudiant.statut),
      this.formaterDate(etudiant.dateInscription)
    ]);

    let csvContent = headers.join(';') + '\n';
    csvData.forEach(row => {
      csvContent += row.join(';') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'liste_inscriptions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Ajoutez cette méthode dans votre classe
confirmerInscription(etudiant: any): void {
  if (etudiant.statut === 'paye') {
    // Appeler la route de confirmation
    this.router.navigate(['/confirmation', etudiant._id]);
  } else {
    alert('Seules les inscriptions payées peuvent être confirmées');
  }
}

// Méthode pour vérifier si l'étudiant peut être confirmé
peutEtreConfirme(etudiant: Etudiant): boolean {
  // Ajoutez 'PXE' comme statut valide pour payé
  return etudiant.statut === 'paye' || etudiant.statut === 'PXE';
}
// Ajoutez ces méthodes dans votre classe ListeEtudiantsComponent

// Compter les étudiants payés
compterPayes(): number {
  return this.etudiants.filter(etudiant => 
    etudiant.statut === 'paye' || etudiant.statut === 'PXE'
  ).length;
}

// Calculer le pourcentage d'étudiants payés
calculerPourcentagePayes(): number {
  if (this.etudiants.length === 0) return 0;
  return Math.round((this.compterPayes() / this.etudiants.length) * 100);
}

// Compter les inscriptions en attente
compterEnAttente(): number {
  return this.etudiants.filter(etudiant => 
    etudiant.statut === 'en-attente'
  ).length;
}

// Calculer le pourcentage d'inscriptions en attente
calculerPourcentageAttente(): number {
  if (this.etudiants.length === 0) return 0;
  return Math.round((this.compterEnAttente() / this.etudiants.length) * 100);
}
chargerEnseignants(): void {
    // Votre logique pour charger les enseignants
    // Par exemple :
    this.enseignantService.getEnseignants().subscribe({
      next: (enseignants) => {
        this.enseignants = enseignants;
      },
      error: (error) => {
        console.error('Erreur chargement enseignants:', error);
      }
    });
  }
  // Dans listeinscription.ts
getStatsEnseignants(): any {
  // Vérifie si la liste enseignants existe et contient des données
  if (!this.enseignants || this.enseignants.length === 0) {
    return {
      total: 0,
      pourcentageActifs: 0,
      actifs: 0,
      inactifs: 0
    };
  }

  const total = this.enseignants.length;
  
  // Compte les enseignants actifs (adaptez 'statut' selon votre structure de données)
  const actifs = this.enseignants.filter(enseignant => 
    enseignant.statut === 'actif' || 
    enseignant.estActif === true
  ).length;
  
  const pourcentageActifs = total > 0 ? Math.round((actifs / total) * 100) : 0;

  return {
    total,
    actifs,
    pourcentageActifs,
    inactifs: total - actifs
  };
}

}