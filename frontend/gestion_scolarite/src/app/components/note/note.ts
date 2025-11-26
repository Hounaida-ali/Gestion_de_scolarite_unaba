import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoteService } from '../../services/note-service';
import { UserService } from '../../services/user-service';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';
import { Formation } from '../../interfaces/formationInterface';
import { Evaluation } from '../../interfaces/evaluationInterface';
import { AddEvaluationPayload } from '../../interfaces/addEvaluationInterface';

interface FiliereOption {
  _id: string;
  nom: string;
  niveaux: string[];
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './note.html',
  styleUrls: ['./note.css'],
})
export class Note {
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];

  selectedEvaluation: Evaluation | null = null;
  showEvalForm = false;

  successMessage = '';
  errorMessage = '';

  departements: DepartementAvecFormations[] = [];
  formations: Formation[] = [];

  // Pour les FILTRES de recherche
  filteredFilieres: FiliereOption[] = [];
  filteredNiveaux: string[] = [];

  // Pour le FORMULAIRE d'ajout/modification
  formFilieres: FiliereOption[] = [];
  formNiveaux: string[] = [];

  // Filtres de recherche
  departementFilter = '';
  filiereFilter = '';
  niveauFilter = '';
  matiereFilter = '';
  enseignantFilter = '';
  typeEvaluationFilter = '';

  matieres: string[] = [];
  enseignants: string[] = [];
  typesEvaluation: string[] = ['td', 'tp', 'controle'];

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private formationEtudiantService: FormationEtudiantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEvaluations();
    this.loadEnseignants();
    this.loadDepartements();
  }

  loadDepartements() {
    this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
      next: (deps) => {
        this.departements = deps;
        console.log('Départements chargés:', deps);
      },
      error: () => console.error('Erreur lors du chargement des départements'),
    });
  }

  loadEvaluations() {
    this.noteService.getEvaluations().subscribe({
      next: (data: Evaluation[]) => {
        this.evaluations = data;
        this.filteredEvaluations = [...data];
        this.matieres = Array.from(new Set(data.map((e) => e.matiere)));

        console.log('✅ Évaluations chargées:', data);
        console.log('📋 Structure première évaluation:', data[0]);
      },
      error: () => (this.errorMessage = 'Erreur lors du chargement des évaluations'),
    });
  }
  loadEnseignants() {
    this.userService.getEnseignants().subscribe({
      next: (data: any[]) => {
        this.enseignants = data.map((e) => `${e.firstName} ${e.lastName}`);
      },
      error: () => console.error('Erreur chargement enseignants'),
    });
  }

  /* ---------------- FILTRES DE RECHERCHE ---------------- */
  onDepartementChange() {
    const dep = this.departements.find((d) => d._id === this.departementFilter);
    this.formations = dep ? dep.formations : [];

    this.filteredFilieres = dep
      ? dep.formations.map((f) => ({
          _id: f._id,
          nom: f.nom,
          niveaux: f.programmes.flatMap((p) => p.niveaux.map((n) => n.nom)),
        }))
      : [];

    this.filiereFilter = '';
    this.niveauFilter = '';
    this.filteredNiveaux = [];
    this.filterEvaluations();
  }

  onFiliereChange() {
    const f = this.filteredFilieres.find((fl) => fl._id === this.filiereFilter);
    this.filteredNiveaux = f ? f.niveaux : [];
    this.niveauFilter = '';
    this.filterEvaluations();
  }

  filterEvaluations(): Evaluation[] {
  console.log('🔍 Filtres actifs:', {
    departementFilter: this.departementFilter,
    filiereFilter: this.filiereFilter,
    niveauFilter: this.niveauFilter,
    matiereFilter: this.matiereFilter,
    typeEvaluationFilter: this.typeEvaluationFilter,
  });

  const filtered = this.evaluations.filter((e) => {
    // Type guards pour éviter l'erreur TS2339
    const evalDeptId = typeof e.departement === 'string' ? e.departement : e.departement?._id;
    const evalFiliereId = typeof e.filiere === 'string' ? e.filiere : e.filiere?._id;

    const matchDept = !this.departementFilter || evalDeptId === this.departementFilter;
    const matchFiliere = !this.filiereFilter || evalFiliereId === this.filiereFilter;
    const matchNiveau = !this.niveauFilter || e.niveau === this.niveauFilter;
    const matchMatiere = !this.matiereFilter || e.matiere === this.matiereFilter;
    const matchType = !this.typeEvaluationFilter || e.typeEvaluation === this.typeEvaluationFilter;

    console.log('Évaluation comparée:', e);
    console.log('Matches:', { matchDept, matchFiliere, matchNiveau, matchMatiere, matchType });

    return matchDept && matchFiliere && matchNiveau && matchMatiere && matchType;
  });

  console.log(`✅ ${filtered.length} évaluation(s) trouvée(s)`);
  this.filteredEvaluations = filtered;
  return filtered;
}



  /* ---------------- FORMULAIRE ---------------- */
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
    this.formFilieres = [];
    this.formNiveaux = [];
    this.showEvalForm = true;
  }

  editEvaluation(evalToEdit: Evaluation) {
    // ✅ CORRECTION: Extraire les IDs si ce sont des objets
    const departementId =
      typeof evalToEdit.departement === 'object' && evalToEdit.departement !== null
        ? (evalToEdit.departement as any)._id
        : evalToEdit.departement;

    const filiereId =
      typeof evalToEdit.filiere === 'object' && evalToEdit.filiere !== null
        ? (evalToEdit.filiere as any)._id
        : evalToEdit.filiere;

    this.selectedEvaluation = {
      ...evalToEdit,
      departement: departementId,
      filiere: filiereId,
    };

    // Pré-charger les filières et niveaux
    if (this.selectedEvaluation.departement) {
      this.onFormDepartementChange();

      if (this.selectedEvaluation.filiere) {
        setTimeout(() => this.onFormFiliereChange(), 100);
      }
    }

    this.showEvalForm = true;
  }

  onFormDepartementChange() {
    if (!this.selectedEvaluation) return;

    const dep = this.departements.find((d) => d._id === this.selectedEvaluation!.departement);

    this.formFilieres = dep
      ? dep.formations.map((f) => ({
          _id: f._id,
          nom: f.nom,
          niveaux: f.programmes.flatMap((p) => p.niveaux.map((n) => n.nom)),
        }))
      : [];

    this.formNiveaux = [];
    this.selectedEvaluation.filiere = '';
    this.selectedEvaluation.niveau = '';
  }

  onFormFiliereChange() {
    if (!this.selectedEvaluation) return;

    const f = this.formFilieres.find((fil) => fil._id === this.selectedEvaluation!.filiere);
    this.formNiveaux = f ? f.niveaux : [];
    this.selectedEvaluation.niveau = '';
  }

  /* ---------------- CRUD ---------------- */
  submitEvaluation() {
    if (!this.selectedEvaluation) return;
    if (this.selectedEvaluation._id) this.updateEvaluation();
    else this.addEvaluation();
  }

  addEvaluation() {
  if (!this.selectedEvaluation) return;

  // Extraire ID si departement/filiere sont des objets
  const departementId =
    typeof this.selectedEvaluation.departement === 'string'
      ? this.selectedEvaluation.departement
      : this.selectedEvaluation.departement?._id;

  const filiereId =
    typeof this.selectedEvaluation.filiere === 'string'
      ? this.selectedEvaluation.filiere
      : this.selectedEvaluation.filiere?._id;

  const payload: AddEvaluationPayload = {
    etudiant: this.selectedEvaluation.etudiant.nom.trim(),
    enseignant: this.selectedEvaluation.enseignant.nom.trim(),
    matiere: this.selectedEvaluation.matiere,
    departement: departementId!, // ⚠️ on force avec ! car on sait que ça existe
    filiere: filiereId,
    niveau: this.selectedEvaluation.niveau,
    typeEvaluation: this.selectedEvaluation.typeEvaluation,
    note: this.selectedEvaluation.note,
    commentaire: this.selectedEvaluation.commentaire || '',
  };

  this.noteService.addEvaluation(payload).subscribe({
    next: (res: any) => {
      this.evaluations.unshift(res.note);
      this.filterEvaluations();
      this.resetEvalForm();
      this.showMessage('Évaluation ajoutée avec succès !', 'success');
    },
    error: (err) => this.showMessage(err.error?.message || "Erreur lors de l'ajout", 'error'),
  });
}


updateEvaluation() {
  if (!this.selectedEvaluation || !this.selectedEvaluation._id) return;

  const departementId =
    typeof this.selectedEvaluation.departement === 'string'
      ? this.selectedEvaluation.departement
      : this.selectedEvaluation.departement?._id;

  const filiereId =
    typeof this.selectedEvaluation.filiere === 'string'
      ? this.selectedEvaluation.filiere
      : this.selectedEvaluation.filiere?._id;

  const payload: AddEvaluationPayload = {
    etudiant: this.selectedEvaluation.etudiant.nom.trim(),
    enseignant: this.selectedEvaluation.enseignant.nom.trim(),
    matiere: this.selectedEvaluation.matiere,
    departement: departementId!,
    filiere: filiereId,
    niveau: this.selectedEvaluation.niveau,
    typeEvaluation: this.selectedEvaluation.typeEvaluation,
    note: this.selectedEvaluation.note,
    commentaire: this.selectedEvaluation.commentaire || '',
  };

  this.noteService.updateEvaluation(this.selectedEvaluation._id, payload).subscribe({
    next: (res: any) => {
      const index = this.evaluations.findIndex((e) => e._id === res.note._id);
      if (index !== -1) this.evaluations[index] = res.note;
      this.filterEvaluations();
      this.resetEvalForm();
      this.showMessage('Évaluation mise à jour avec succès !', 'success');
    },
    error: (err) =>
      this.showMessage(err.error?.message || 'Erreur lors de la mise à jour', 'error'),
  });
}


  deleteEvaluation(evaluation: Evaluation) {
    if (!evaluation._id || !confirm('Voulez-vous supprimer cette évaluation ?')) return;

    this.noteService.deleteEvaluation(evaluation._id).subscribe({
      next: () => {
        this.evaluations = this.evaluations.filter((e) => e._id !== evaluation._id);
        this.filterEvaluations();
        this.showMessage('Évaluation supprimée avec succès !', 'success');
      },
      error: (err) =>
        this.showMessage(err.error?.message || 'Erreur lors de la suppression', 'error'),
    });
  }

  resetEvalForm() {
    this.selectedEvaluation = null;
    this.showEvalForm = false;
    this.formFilieres = [];
    this.formNiveaux = [];
  }

  refreshPage() {
    this.loadEvaluations();
    this.showMessage('Page actualisée', 'success');
  }

  /* ---------------- UTILITAIRES ---------------- */
  showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
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

  // ✅ Méthode helper pour afficher le nom du département
  getDepartementNom(evaluation: Evaluation): string {
    const depId =
      typeof evaluation.departement === 'object' && evaluation.departement !== null
        ? (evaluation.departement as any)._id
        : evaluation.departement;

    const dep = this.departements.find((d) => d._id === depId);
    return dep?.nom || 'N/A';
  }

  // ✅ Méthode helper pour afficher le nom de la filière
  getFiliereNom(evaluation: Evaluation): string {
    const filId =
      typeof evaluation.filiere === 'object' && evaluation.filiere !== null
        ? (evaluation.filiere as any)._id
        : evaluation.filiere;

    const dep = this.departements.find((d) => d.formations.some((f) => f._id === filId));

    if (dep) {
      const fil = dep.formations.find((f) => f._id === filId);
      return fil?.nom || 'N/A';
    }

    return 'N/A';
  }
}
