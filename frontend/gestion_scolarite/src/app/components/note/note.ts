import { Component } from '@angular/core';
import { NoteService } from '../../services/note-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { User } from '../../interfaces/userInterface';
import { Evaluation } from '../../interfaces/evaluationInterface';
import { AddEvaluationPayload } from '../../interfaces/addEvaluationInterface';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './note.html',
  styleUrls: ['./note.css'],
})
export class Note {
  // Exemple dans le composant
  etudiants: User[] = []; // sera rempli via un service API
  enseignants: string[] = [];
  // sera rempli via un service API
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];

  // Formulaire
  showEvalForm = false;
  selectedEvaluation: Evaluation | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  // Filtres
  departementFilter = '';
  filiereFilter = '';
  niveauFilter = '';
  matiereFilter = '';
  enseignantFilter = '';
  typeEvaluationFilter = '';

  // Données pour filtres dynamiques
  departements = [
    {
      nom: 'économie',
      filieres: [
        { nom: 'science-économie', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'économie-moniteur', niveaux: ['licence1', 'licence2', 'licence3'] },
      ],
    },
    {
      nom: 'droit',
      filieres: [{ nom: 'droit', niveaux: ['licence1', 'licence2', 'licence3'] }],
    },
    {
      nom: 'gestion',
      filieres: [{ nom: 'gestion', niveaux: ['licence1', 'licence2', 'licence3'] }],
    },
  ];
  matieres: string[] = [];
  typesEvaluation: string[] = ['td', 'tp', 'controle'];
  filteredFilieres: string[] = [];
  filteredNiveaux: string[] = [];
  niveaux: string[] = ['licence1', 'licence2', 'licence3']; // pour les formulaires

  constructor(private noteService: NoteService, private userService: UserService) {}

  ngOnInit() {
    this.loadEvaluations();
    this.loadEnseignants();
    // Charger les étudiants
    this.userService.getEtudiants().subscribe((data: User[]) => {
      this.etudiants = data;
    });
  }

  loadEvaluations() {
    this.noteService.getEvaluations().subscribe((data: Evaluation[]) => {
      this.evaluations = data;
      this.filteredEvaluations = [...data];
      this.matieres = Array.from(new Set(data.map((e) => e.matiere)));
      this.enseignants = Array.from(new Set(data.map((e) => e.enseignant.nom))); // ✅ ajout ici
    });
  }

  loadEnseignants() {
    this.userService.getEnseignants().subscribe((data: User[]) => {
      this.enseignants = data.map((e) => `${e.firstName} ${e.lastName}`); // ✅ Nom complet
    });
  }

  onDepartementChange() {
    const dep = this.departements.find((d) => d.nom === this.departementFilter);
    this.filteredFilieres = dep ? dep.filieres.map((f) => f.nom) : [];
    this.filiereFilter = '';
    this.niveauFilter = '';
    this.filteredNiveaux = [];
    this.filteredEvaluations = [];
  }

  onFiliereChange() {
    const dep = this.departements.find((d) => d.nom === this.departementFilter);
    if (dep) {
      const fil = dep.filieres.find((f) => f.nom === this.filiereFilter);
      this.filteredNiveaux = fil ? fil.niveaux : [];
    } else {
      this.filteredNiveaux = [];
    }
    this.niveauFilter = '';
    this.filteredEvaluations = [];
  }

  // Filtrage dynamique des filières selon le département sélectionné
  // Filtrage dynamique des filières selon le département sélectionné (formulaire)
  onFormDepartementChange() {
    if (!this.selectedEvaluation) return;

    const dep = this.departements.find((d) => d.nom === this.selectedEvaluation!.departement);
    this.filteredFilieres = dep ? dep.filieres.map((f) => f.nom) : [];

    // Réinitialiser filière et niveau
    this.selectedEvaluation.filiere = '';
    this.filteredNiveaux = [];
    this.selectedEvaluation.niveau = '';
  }

  // Filtrage dynamique des niveaux selon la filière sélectionnée (formulaire)
  onFormFiliereChange(selectedFiliere: string) {
    if (!this.selectedEvaluation) return;

    // Mettre à jour la filière sélectionnée
    this.selectedEvaluation.filiere = selectedFiliere;

    // Trouver le département correspondant
    const dep = this.departements.find((d) => d.nom === this.selectedEvaluation!.departement);

    if (dep) {
      // Trouver la filière dans ce département
      const fil = dep.filieres.find((f) => f.nom === selectedFiliere);

      // Mettre à jour les niveaux filtrés pour le formulaire
      this.filteredNiveaux = fil ? [...fil.niveaux] : [];
    } else {
      this.filteredNiveaux = [];
    }

    // Réinitialiser le niveau sélectionné
    this.selectedEvaluation.niveau = '';
  }

  /*** FORMULAIRE ***/
  // Ouvrir le formulaire pour ajouter
  newEvaluation() {
    this.selectedEvaluation = {
      _id: '',
      etudiant: { id: '', nom: '' },
      enseignant: { id: '', nom: '' },
      matiere: '',
      departement: '',
      filiere: '',
      niveau: '',
      typeEvaluation: 'controle',
      note: 0,
      commentaire: '',
      dateCreation: new Date().toISOString(),
    };
    this.showEvalForm = true;
    this.filteredFilieres = [];
    this.filteredNiveaux = [];
  }

  getAppreciation(note: number): string {
    if (note >= 0 && note <= 5) return 'Très insuffisant';
  if (note > 5 && note <= 9) return 'Insuffisant';
  if (note >= 10 && note <= 11) return 'Passable';
  if (note >= 12 && note <= 13) return 'Assez bien';
  if (note >= 14 && note <= 16) return 'Bien';
  if (note >= 17 && note <= 19) return 'Très bien';
  if (note === 20) return 'Excellent';
    return 'Note invalide';
  }
  filterEvaluations() {
    this.filteredEvaluations = this.evaluations.filter(
      (e) =>
        (!this.departementFilter || e.departement === this.departementFilter) &&
        (!this.filiereFilter || e.filiere === this.filiereFilter) &&
        (!this.niveauFilter || e.niveau === this.niveauFilter) &&
        (!this.matiereFilter || e.matiere === this.matiereFilter) &&
        (!this.enseignantFilter ||
          e.enseignant.nom.trim().toLowerCase() === this.enseignantFilter.trim().toLowerCase()) &&
        (!this.typeEvaluationFilter || e.typeEvaluation === this.typeEvaluationFilter)
    );
  }

  // Ouvrir le formulaire pour éditer
  editEvaluation(evalToEdit: Evaluation) {
    this.selectedEvaluation = { ...evalToEdit }; // clone pour ne pas modifier directement
    this.showEvalForm = true;

    // Mettre à jour les filières disponibles selon le département
    this.onFormDepartementChange();

    // Mettre à jour les niveaux disponibles selon la filière existante
    if (this.selectedEvaluation.filiere) {
      this.onFormFiliereChange(this.selectedEvaluation.filiere);
    }
  }

  // ---------------- Notifications ----------------
  showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), duration);
    } else {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), duration);
    }
  }

  // Ajouter une évaluation
  addEvaluation() {
    // ❌ Vérification simple que tous les champs obligatoires sont remplis
    if (
      !this.selectedEvaluation?.etudiant?.nom?.trim() ||
      !this.selectedEvaluation?.enseignant?.nom?.trim() ||
      !this.selectedEvaluation?.matiere ||
      !this.selectedEvaluation?.departement ||
      !this.selectedEvaluation?.typeEvaluation ||
      this.selectedEvaluation?.note == null
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      this.successMessage = '';
      return;
    }

    // 📝 Payload pour le backend (seulement noms)
    const payload = {
      etudiant: this.selectedEvaluation.etudiant.nom.trim(),
      enseignant: this.selectedEvaluation.enseignant.nom.trim(),
      matiere: this.selectedEvaluation.matiere,
      departement: this.selectedEvaluation.departement,
      filiere: this.selectedEvaluation.filiere || '',
      niveau: this.selectedEvaluation.niveau || '',
      typeEvaluation: this.selectedEvaluation.typeEvaluation,
      note: this.selectedEvaluation.note,
      commentaire: this.selectedEvaluation.commentaire || '',
    };

    this.noteService.addEvaluation(payload).subscribe({
      next: (res: any) => {
        // 🔹 Reconstruire un vrai Evaluation pour le frontend
        const newEval: Evaluation = {
          _id: res.note._id,
          etudiant: { id: res.note.etudiant.id, nom: res.note.etudiant.nom },
          enseignant: { id: res.note.enseignant.id, nom: res.note.enseignant.nom },
          matiere: res.note.matiere,
          departement: res.note.departement,
          filiere: res.note.filiere || '',
          niveau: res.note.niveau || '',
          typeEvaluation: res.note.typeEvaluation,
          note: res.note.note,
          commentaire: res.note.commentaire || '',
          dateCreation: res.note.dateCreation || new Date().toISOString(),
        };

        // 🔹 Ajouter à la liste frontend
        this.evaluations.unshift(newEval);
        this.filteredEvaluations = [...this.evaluations];

        // 🔹 Messages et réinitialisation du formulaire
        this.successMessage = res.message || 'Note ajoutée avec succès.';
        this.errorMessage = '';
        this.resetEvalForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'ajout de la note.";
        this.successMessage = '';
        console.error(err);
      },
    });
  }

  updateEvaluation() {
    if (!this.selectedEvaluation || !this.selectedEvaluation._id) return;

    // ❌ Vérification simple que tous les champs obligatoires sont remplis
    if (
      !this.selectedEvaluation.etudiant?.nom?.trim() ||
      !this.selectedEvaluation.enseignant?.nom?.trim() ||
      !this.selectedEvaluation.matiere ||
      !this.selectedEvaluation.departement ||
      !this.selectedEvaluation.typeEvaluation ||
      this.selectedEvaluation.note == null
    ) {
      this.showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // 📝 Payload pour le backend (AddEvaluationPayload)
    const payload: AddEvaluationPayload = {
      etudiant: this.selectedEvaluation.etudiant.nom.trim(),
      enseignant: this.selectedEvaluation.enseignant.nom.trim(),
      matiere: this.selectedEvaluation.matiere,
      departement: this.selectedEvaluation.departement,
      filiere: this.selectedEvaluation.filiere || '',
      niveau: this.selectedEvaluation.niveau || '',
      typeEvaluation: this.selectedEvaluation.typeEvaluation,
      note: this.selectedEvaluation.note,
      commentaire: this.selectedEvaluation.commentaire || '',
    };

    // 🔹 Appel au service
    this.noteService.updateEvaluation(this.selectedEvaluation._id, payload).subscribe({
      next: (res: any) => {
        // Reconstruire l'objet Evaluation pour le frontend
        const updatedEval: Evaluation = {
          _id: res.note._id,
          etudiant: { id: res.note.etudiant.id, nom: res.note.etudiant.nom },
          enseignant: { id: res.note.enseignant.id, nom: res.note.enseignant.nom },
          matiere: res.note.matiere,
          departement: res.note.departement,
          filiere: res.note.filiere || '',
          niveau: res.note.niveau || '',
          typeEvaluation: res.note.typeEvaluation,
          note: res.note.note,
          commentaire: res.note.commentaire || '',
          dateCreation: res.note.dateCreation || new Date().toISOString(),
        };

        // 🔹 Remplacer l'ancienne note dans la liste
        const index = this.evaluations.findIndex((e) => e._id === updatedEval._id);
        if (index !== -1) this.evaluations[index] = updatedEval;
        this.filteredEvaluations = [...this.evaluations];

        this.showMessage(res.message || 'Évaluation mise à jour avec succès !', 'success');
        this.resetEvalForm();
      },
      error: (err) => {
        console.error(err);
        this.showMessage(err.error?.message || 'Erreur lors de la mise à jour.', 'error');
      },
    });
  }

  deleteEvaluation(evalToDelete: Evaluation) {
    if (!evalToDelete._id) return;
    this.noteService.deleteEvaluation(evalToDelete._id).subscribe({
      next: () => {
        this.evaluations = this.evaluations.filter((e) => e._id !== evalToDelete._id);
        this.filterEvaluations();
        this.showMessage('Évaluation supprimée avec succès !', 'success');
      },
      error: () => this.showMessage('Erreur lors de la suppression.', 'error'),
    });
  }

  // Réinitialiser le formulaire
  resetEvalForm() {
    this.selectedEvaluation = null;
    this.showEvalForm = false;
  }

  refreshPage() {
    window.location.reload();
  }
}
