import { Component } from '@angular/core';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { EtudiantService } from '../../services/etudiant-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';


@Component({
  selector: 'app-listinscription',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listinscription.html',
  styleUrl: './listinscription.css',
})
export class Listinscription {
  etudiants: any[] = [];
etudiantsFiltres: any[] = [];
  chargement: boolean = true;
  erreur: string = '';
  nomDepartement: string = '';
  nomFormation: string = '';
  departementsAvecFormations: DepartementAvecFormations[] = [];
  departements: DepartementAvecFormations[] = [];

  // Filtres
  filtreStatut: string = 'tous';
  filtreDepartement: string = 'tous';
  filtreRecherche: string = '';

  constructor(private etudiantService: EtudiantService, private router: Router, private formationEtudiantService: FormationEtudiantService,
  ) {}

  ngOnInit(): void {
    this.chargerEtudiants();
     this.chargerDepartements();
     this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
    next: (deps) => (this.departements = deps),
    error: () => console.error('Erreur lors du chargement des départements'),
  });
    }
chargerDepartements(): void {
  this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
    next: (data) => {
      this.departementsAvecFormations = data;
    },
    error: () => console.error("Erreur chargement des départements")
  });
}
getNomDepartement(id: string): string {
  const dep = this.departementsAvecFormations.find(d => d._id === id);
  return dep?.nom || id;
}

getNomFormation(idDep: string, idFormation: string): string {
  const dep = this.departementsAvecFormations.find(d => d._id === idDep);
  if (!dep) return idFormation;

  const f = dep.formations.find(form => form._id === idFormation);
  return f?.nom || idFormation;
}

  chargerEtudiants(): void {
    this.chargement = true;
    this.etudiantService.getAllEtudiants().subscribe({
      next: (etudiants: Etudiant[]) => {
        // TYPAGE EXPLICITE
        this.etudiants = etudiants;
        this.etudiantsFiltres = etudiants;
        this.chargement = false;
        console.log(this.etudiants);
      },
      error: (error: any) => {
        // TYPAGE EXPLICITE
        console.error('Erreur chargement étudiants:', error);
        this.erreur = 'Erreur lors du chargement des inscriptions';
        this.chargement = false;
      },
    });
  }

  // Méthodes de filtrage
  appliquerFiltres(): void {
    this.etudiantsFiltres = this.etudiants.filter((etudiant) => {
      // Filtre par statut
      const matchStatut = this.filtreStatut === 'tous' || etudiant.statut === this.filtreStatut;

      // Filtre par département
      const matchDepartement =
        this.filtreDepartement === 'tous' || etudiant.departement === this.filtreDepartement;

      // Filtre par recherche (nom, prénom, email)
      const recherche = this.filtreRecherche.toLowerCase();
      const matchRecherche =
        !this.filtreRecherche ||
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
      informatique: 'Licence Informatique',
      gestion: 'Licence Gestion',
      droit: 'Licence Droit',
      psychologie: 'Licence Psychologie',
      'master-info': 'Master Informatique',
      'master-gestion': 'Master Management',
    };
    return formations[formationValue] || formationValue;
  }

  getModeFormationLabel(modeValue: string | undefined): string {
    if (!modeValue) return 'Non spécifié';
    const modes: { [key: string]: string } = {
      presentiel: 'Présentiel',
      'en-ligne': 'En ligne',
    };
    return modes[modeValue] || modeValue;
  }

  getDepartementLabel(departementValue: string | undefined): string {
    if (!departementValue) return 'Non spécifié';
    const departements: { [key: string]: string } = {
      économie: 'Économie',
      droit: 'Droit',
      gestion: 'Gestion',
    };
    return departements[departementValue] || departementValue;
  }

  getNiveauEtudesLabel(niveauValue: string | undefined): string {
    if (!niveauValue) return 'Non spécifié';
    const niveaux: { [key: string]: string } = {
      bac: 'Baccalauréat',
      bac1: 'Bac+1',
      bac2: 'Bac+2',
      bac3: 'Bac+3',
      bac4: 'Bac+4',
      bac5: 'Bac+5',
    };
    return niveaux[niveauValue] || niveauValue;
  }

  getStatutLabel(statutValue: string | undefined): string {
    if (!statutValue) return 'Statut inconnu';
    const statuts: { [key: string]: string } = {
      'en-attente': 'En attente',
      valide: 'Validé',
      rejete: 'Rejeté',
      paye: 'Payé',
      confirme: 'Confirmé',
    };
    return statuts[statutValue] || statutValue;
  }

  getStatutClass(statut: string | undefined): string {
    if (!statut) return 'statut-inconnu';
    const classes: { [key: string]: string } = {
      'en-attente': 'statut-attente',
      valide: 'statut-valide',
      rejete: 'statut-rejete',
      paye: 'statut-paye',
      confirme: 'statut-confirme',
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
      minute: '2-digit',
    });
  }

  getDocumentsLabels(documents: string[] | undefined): string {
    if (!documents || documents.length === 0) return 'Aucun document';

    const labels: { [key: string]: string } = {
      cv: 'Curriculum Vitae',
      'lettre-motivation': 'Lettre de motivation',
      'releves-notes': 'Relevés de notes',
      diplome: 'Copie du diplôme',
    };

    return documents.map((doc) => labels[doc] || doc).join(', ');
  }

  // Méthode pour exporter en CSV
  exporterCSV(): void {
    const headers = [
      'ID Provisoire',
      'Nom complet',
      'Email',
      'Téléphone',
      'Département',
      'Formation',
      'Niveau',
      'Statut',
      'Date inscription',
    ];
    const csvData = this.etudiantsFiltres.map((etudiant) => [
      etudiant.idProvisoire || 'N/A',
      `${etudiant.prenom} ${etudiant.nom}`,
      etudiant.email,
      etudiant.telephone,
      this.getDepartementLabel(etudiant.departement),
      `${this.getFormationLabel(etudiant.formation)} - ${this.getModeFormationLabel(
        etudiant.modeFormation
      )}`,
      this.getNiveauEtudesLabel(etudiant.niveau),
      this.getStatutLabel(etudiant.statut),
      this.formaterDate(etudiant.dateInscription),
    ]);

    let csvContent = headers.join(';') + '\n';
    csvData.forEach((row) => {
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
    return this.etudiants.filter(
      (etudiant) => etudiant.statut === 'paye' || etudiant.statut === 'PXE'
    ).length;
  }

  // Calculer le pourcentage d'étudiants payés
  calculerPourcentagePayes(): number {
    if (this.etudiants.length === 0) return 0;
    return Math.round((this.compterPayes() / this.etudiants.length) * 100);
  }

  // Compter les inscriptions en attente
  compterEnAttente(): number {
    return this.etudiants.filter((etudiant) => etudiant.statut === 'en-attente').length;
  }

  // Calculer le pourcentage d'inscriptions en attente
  calculerPourcentageAttente(): number {
    if (this.etudiants.length === 0) return 0;
    return Math.round((this.compterEnAttente() / this.etudiants.length) * 100);
  }
  validerEtudiant(etudiant: Etudiant): void {
    if (!etudiant._id) return;

    this.etudiantService.validerInscription(etudiant._id).subscribe({
      next: (response: any) => {
        etudiant.statut = 'valide'; // Mise à jour instantanée dans la liste
        this.appliquerFiltres(); // Ré-applique les filtres
      },
      error: (error) => {
        console.error('Erreur validation:', error);
        alert('Une erreur est survenue lors de la validation.');
      },
    });
  }

  // extraireNomFichier(url: string): string {
  //   if (!url) return '';
  //   return url.split('/').pop() || url;
  // }
}
