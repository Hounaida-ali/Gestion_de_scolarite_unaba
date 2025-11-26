import { Component } from '@angular/core';
import { Enseignant } from '../../interfaces/enseignantInterface';
import { Departement } from '../../interfaces/departementInterface';
import { EnseignantService } from '../../services/enseignant-service';
import { DepartementService } from '../../services/departement-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cours',
  imports: [CommonModule, FormsModule],
  templateUrl: './cours.html',
  styleUrl: './cours.css',
})
export class Cours {
enseignants: Enseignant[] = [];
    departementsForm: { value: string; label: string }[] = [];

  chargement = true;
  erreur = '';
  departements: Departement[] = [];

  showForm = false;
  isEditMode = false;
  isViewMode = false;
  enseignantForm: Enseignant = this.initializeForm();
  formTitle = '';
  submitted = false;

  // ✅ Nouveaux messages dynamiques
  successMessage = '';
  errorMessage = '';

  // Filtres
  filtreRecherche = '';
  filtreDepartement = 'tous';
  filtreStatut = 'tous';

  // Options
  // departements = [
  //   { value: 'tous', label: 'Tous les départements' },
  //   { value: 'Informatique', label: 'Informatique' },
  //   { value: 'Économie', label: 'Économie' },
  //   { value: 'Droit', label: 'Droit' },
  //   { value: 'Gestion', label: 'Gestion' },
  // ];

  statuts = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'actif', label: 'Actif' },
    { value: 'inactif', label: 'Inactif' },
    { value: 'congé', label: 'Congé' },
    { value: 'retraité', label: 'Retraité' },
  ];

  grades = [
    { value: 'Professeur', label: 'Professeur' },
    { value: 'Maître de Conférences', label: 'Maître de Conférences' },
    { value: 'Maître Assistant', label: 'Maître Assistant' },
    { value: 'Assistant', label: 'Assistant' },
    { value: 'Vacataire', label: 'Vacataire' },
  ];

  // departementsForm = [
  //   { value: 'Informatique', label: 'Informatique' },
  //   { value: 'Économie', label: 'Économie' },
  //   { value: 'Droit', label: 'Droit' },
  //   { value: 'Gestion', label: 'Gestion' },
  // ];

  specialites = [
    { value: 'Mathématiques', label: 'Mathématiques' },
    { value: 'Informatique', label: 'Informatique' },
    { value: 'Physique', label: 'Physique' },
    { value: 'Chimie', label: 'Chimie' },
    { value: 'Biologie', label: 'Biologie' },
    { value: 'Économie', label: 'Économie' },
    { value: 'Droit', label: 'Droit' },
    { value: 'Gestion', label: 'Gestion' },
    { value: 'Lettres', label: 'Lettres' },
    { value: 'Histoire', label: 'Histoire' },
    { value: 'Philosophie', label: 'Philosophie' },
  ];

  constructor(
    private enseignantService: EnseignantService,
    private departementService: DepartementService
  ) {}

  ngOnInit(): void {
    this.chargerEnseignants();
    this.chargerDepartements();
  }
// 🔹 Charger les départements depuis le backend
  chargerDepartements(): void {
    this.departementService.getAll().subscribe({
      next: (departements) => {
        this.departementsForm = departements.map((dep: any) => ({
          value: dep._id,
          label: dep.nom
        }));
      },
      error: (err) => {
        console.error('Erreur chargement départements:', err);
        this.showMessage('Erreur lors du chargement des départements', 'error');
      }
    });
  }
  chargerEnseignants(): void {
    this.chargement = true;
    this.enseignantService.getEnseignants().subscribe({
      next: (enseignants: Enseignant[]) => {
        this.enseignants = enseignants;
        this.chargement = false;
      },
      error: (error) => {
        this.showMessage('Erreur lors du chargement des enseignants', 'error');
        this.chargement = false;
        console.error('Erreur:', error);
      },
    });
  }

  get enseignantsFiltres(): Enseignant[] {
    return this.enseignants.filter((enseignant) => {
      const matchRecherche =
        !this.filtreRecherche ||
        enseignant.nom.toLowerCase().includes(this.filtreRecherche.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(this.filtreRecherche.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(this.filtreRecherche.toLowerCase()) ||
        enseignant.matricule.toLowerCase().includes(this.filtreRecherche.toLowerCase());

      const matchDepartement =
        this.filtreDepartement === 'tous' || enseignant.departement === this.filtreDepartement;
      const matchStatut = this.filtreStatut === 'tous' || enseignant.statut === this.filtreStatut;

      return matchRecherche && matchDepartement && matchStatut;
    });
  }

  creerEnseignant(): void {
    this.isEditMode = true;
    this.isViewMode = false;
    this.enseignantForm = this.initializeForm();
    this.formTitle = 'Nouvel Enseignant';
    this.showForm = true;
    this.submitted = false;
  }

  voirDetails(enseignant: Enseignant): void {
    this.isEditMode = false;
    this.isViewMode = true;
    this.enseignantForm = { ...enseignant };
    this.formTitle = `Détails - ${enseignant.prenom} ${enseignant.nom}`;
    this.showForm = true;
  }

  modifierEnseignant(enseignant: Enseignant): void {
    this.isEditMode = true;
    this.isViewMode = false;
    this.enseignantForm = { ...enseignant };
    this.formTitle = `Modifier - ${enseignant.prenom} ${enseignant.nom}`;
    this.showForm = true;
  }

  supprimerEnseignant(enseignant: Enseignant): void {
    if (!confirm(`Supprimer ${enseignant.prenom} ${enseignant.nom} ?`)) return;

    this.enseignantService.deleteEnseignant(enseignant._id!).subscribe({
      next: (response: any) => {
        this.chargerEnseignants();

        // ✅ Message backend amélioré
        const message =
          response.message ||
          `Enseignant "${enseignant.prenom} ${enseignant.nom}" supprimé avec succès !`;
        this.showMessage(message, 'success');
      },
      error: (error) => {
        console.error('Erreur suppression:', error);

        // ✅ Message backend amélioré
        const backendMessage =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          "Erreur lors de la suppression de l'enseignant.";
        this.showMessage(backendMessage, 'error');
      },
    });
  }

  initializeForm(): Enseignant {
    return {
      _id: '',
      matricule: 'ENS' + Date.now().toString().slice(-6),
      nom: '',
      prenom: '',
      dateNaissance: '',
      email: '',
      telephone: '',
      specialite: '',
      grade: 'Assistant',
      departement: 'Informatique',
      dateEmbauche: new Date().toISOString().split('T')[0],
      statut: 'actif',
    };
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.isFormValid()) {
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (!this.isValidEmail(this.enseignantForm.email)) {
      this.showMessage('Veuillez entrer une adresse email valide', 'error');
      return;
    }

    if (!this.isValidDateNaissance(this.enseignantForm.dateNaissance)) {
      this.showMessage("L'enseignant doit avoir au moins 18 ans", 'error');
      return;
    }

    if (this.enseignantForm._id) this.updateEnseignant();
    else this.createEnseignant();
  }

  isFormValid(): boolean {
    return !!(
      this.enseignantForm.nom &&
      this.enseignantForm.prenom &&
      this.enseignantForm.dateNaissance &&
      this.enseignantForm.email &&
      this.enseignantForm.telephone &&
      this.enseignantForm.specialite &&
      this.enseignantForm.grade &&
      this.enseignantForm.departement &&
      this.enseignantForm.dateEmbauche &&
      this.enseignantForm.statut
    );
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidDateNaissance(dateNaissance: string): boolean {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }

  createEnseignant(): void {
    const donneesEnseignant = { ...this.enseignantForm };
    delete donneesEnseignant._id;

    this.enseignantService.createEnseignant(donneesEnseignant).subscribe({
      next: (response: any) => {
        const nouvelEnseignant = response.enseignant || response;
        this.enseignants.push(nouvelEnseignant);
        this.showForm = false;

        // ✅ Message backend amélioré
        const message =
          response.message ||
          `Enseignant "${nouvelEnseignant.prenom} ${nouvelEnseignant.nom}" créé avec succès !`;
        this.showMessage(message, 'success');
      },
      error: (error) => {
        console.error('Erreur création:', error);

        // ✅ Message backend amélioré
        const backendMessage =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          "Erreur lors de la création de l'enseignant.";
        this.showMessage(backendMessage, 'error');
      },
    });
  }

  updateEnseignant(): void {
    this.enseignantService
      .updateEnseignant(this.enseignantForm._id!, this.enseignantForm)
      .subscribe({
        next: (response: any) => {
          const enseignant = response.enseignant || response;
          const index = this.enseignants.findIndex((e) => e._id === enseignant._id);
          if (index !== -1) this.enseignants[index] = enseignant;
          this.showForm = false;

          // ✅ Message backend amélioré
          const message =
            response.message ||
            `Enseignant "${enseignant.prenom} ${enseignant.nom}" modifié avec succès !`;
          this.showMessage(message, 'success');
        },
        error: (error) => {
          console.error('Erreur modification:', error);

          // ✅ Message backend amélioré
          const backendMessage =
            error.error?.message ||
            error.error?.error ||
            error.message ||
            "Erreur lors de la modification de l'enseignant.";
          this.showMessage(backendMessage, 'error');
        },
      });
  }

  cancelForm(): void {
    this.showForm = false;
    this.enseignantForm = this.initializeForm();
    this.submitted = false;
    this.isViewMode = false;
  }

  // ✅ Nouveau système de notification
  showMessage(msg: string, type: 'success' | 'error', duration = 4000) {
    if (type === 'success') {
      this.successMessage = msg;
      this.errorMessage = '';
      setTimeout(() => (this.successMessage = ''), duration);
    } else {
      this.errorMessage = msg;
      this.successMessage = '';
      setTimeout(() => (this.errorMessage = ''), duration);
    }
  }

  getAge(dateNaissance: string): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  // getAnciennete(dateEmbauche: string): number {
  //   const today = new Date();
  //   const embaucheDate = new Date(dateEmbauche);
  //   let anciennete = today.getFullYear() - embaucheDate.getFullYear();
  //   const monthDiff = today.getMonth() - embaucheDate.getMonth();
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < embaucheDate.getDate()))
  //     anciennete--;
  //   return anciennete;
  // }

  formaterDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getGradeClass(grade: string): string {
    const classes: { [key: string]: string } = {
      Professeur: 'grade-professeur',
      'Maître de Conférences': 'grade-mc',
      'Maître Assistant': 'grade-ma',
      Assistant: 'grade-assistant',
      Vacataire: 'grade-vacataire',
    };
    return classes[grade] || 'grade-default';
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      actif: 'statut-actif',
      inactif: 'statut-inactif',
      congé: 'statut-conge',
      retraité: 'statut-retraite',
    };
    return classes[statut] || 'statut-default';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      actif: 'Actif',
      inactif: 'Inactif',
      congé: 'En congé',
      retraité: 'Retraité',
    };
    return labels[statut] || statut;
  }
  getDepartementLabel(departementId: any): string {
  const dept = this.departementsForm.find(d => d.value === departementId);
  return dept ? dept.label : 'Non défini';
}

}

