import { Component } from '@angular/core';
import { NoteEtudiantService } from '../../services/note-etudiant-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Evaluation } from '../../interfaces/evaluationInterface';


// export interface Evaluation {
//   _id: string;
//   etudiant: { id: string; nom: string };
//   enseignant: { id: string; nom: string };
//   matiere: string;
//   departement: string;
//   filiere?: string;
//   niveau?: string;
//   typeEvaluation: 'examen' | 'controle';
//   note: number;
//   commentaire?: string;
//   dateCreation: string;
// }

@Component({
  selector: 'app-note-etudiant',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './note-etudiant.html',
  styleUrl: './note-etudiant.css'
})
export class NoteEtudiant {
evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];

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
  enseignants: string[] = [];
  typesEvaluation: string[] = ['examen', 'td', 'tp', 'controle'];
  filteredFilieres: string[] = [];
  filteredNiveaux: string[] = [];

  constructor(private noteEtudiantService: NoteEtudiantService) {}

  ngOnInit() {
    this.loadEvaluations();
  }

  loadEvaluations() {
  this.noteEtudiantService.getEvaluations().subscribe((data) => {
    this.evaluations = data;
    this.filteredEvaluations = [...this.evaluations];
    this.matieres = Array.from(new Set(data.map(e => e.matiere)));
    this.enseignants = Array.from(new Set(data.map(e => e.enseignant.nom)));
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
  
  filterEvaluations() {
  this.filteredEvaluations = this.evaluations.filter(
    (e) =>
      (!this.departementFilter || e.departement === this.departementFilter) &&
      (!this.filiereFilter || e.filiere === this.filiereFilter) &&
      (!this.niveauFilter || e.niveau === this.niveauFilter) &&
      (!this.matiereFilter || e.matiere === this.matiereFilter) &&
      (!this.enseignantFilter || e.enseignant.nom.trim() === this.enseignantFilter.trim()) &&
      (!this.typeEvaluationFilter || e.typeEvaluation === this.typeEvaluationFilter)
  );
}
getAppreciation(note: number): string {
  const n = Math.round(Number(note));
  if (n >= 0 && n <= 5) return 'Très insuffisant';
  if (n >= 6 && n <= 9) return 'Insuffisant';
  if (n >= 10 && n <= 11) return 'Passable';
  if (n >= 12 && n <= 13) return 'Assez bien';
  if (n >= 14 && n <= 16) return 'Bien';
  if (n >= 17 && n <= 19) return 'Très bien';
  if (n === 20) return 'Excellent';
  return 'Note invalide';
}


}
