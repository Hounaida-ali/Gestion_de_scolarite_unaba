import { Component } from '@angular/core';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';
import { Programme } from '../../interfaces/ProgramInterface';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { CommonModule } from '@angular/common';
import { Program } from '../program/program';
import { RouterLink, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formation-etudiant',
  standalone: true,
  imports: [CommonModule, Program, RouterLink, ReactiveFormsModule, RouterModule],
  templateUrl: './formation-etudiant.html',
  styleUrl: './formation-etudiant.css',
})
export class FormationEtudiant {
  departements: DepartementAvecFormations[] = [];
  selectedDepartement?: DepartementAvecFormations;
  selectedProgramme: any = null;
  modalOpen = false;
  isLoading = false;
  error: string | null = null;

  showFormationForm = false;
  formationForm: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private formationEtudiantService: FormationEtudiantService) {
    this.formationForm = this.fb.group({
      nom: ['', Validators.required],
      departementId: ['', Validators.required],
      programmes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadData();

    // Test simple pour vérifier que la route fonctionne
    this.formationEtudiantService.getFormationsByDepartement('68e0f02daf2f0da2695fdf1d').subscribe({
      next: (formations) => console.log('Formations reçues :', formations),
      error: (err) => console.error('Erreur API formations :', err),
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
      next: (data: DepartementAvecFormations[]) => {
        console.log('Départements avec formations :', data);
        this.departements = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.error = 'Erreur lors du chargement';
        this.isLoading = false;
      },
    });
  }

  get programmes(): FormArray {
    return this.formationForm.get('programmes') as FormArray;
  }

  newFormation(): void {
    this.showFormationForm = true;
    if (this.programmes.length === 0) {
      this.addProgramme();
    }
  }

  // PROGRAMME
  addProgramme() {
    this.programmes.push(
      this.fb.group({
        departement: ['', Validators.required],
        code: ['', Validators.required],
        nom: ['', Validators.required],
        description: [''],
        duree: [''],
        credits: [''],
        diplome: [''],
        acces: [''],
        niveaux: this.fb.array([]),
      })
    );
  }

  removeProgramme(index: number) {
    this.programmes.removeAt(index);
  }

  getNiveaux(programmeIndex: number): FormArray {
    return this.programmes.at(programmeIndex).get('niveaux') as FormArray;
  }

  addNiveau(programmeIndex: number) {
    this.getNiveaux(programmeIndex).push(
      this.fb.group({
        code: ['', Validators.required],
        nom: ['', Validators.required],
        description: [''],
        semestres: this.fb.array([]),
      })
    );
  }

  removeNiveau(programmeIndex: number, niveauIndex: number) {
    this.getNiveaux(programmeIndex).removeAt(niveauIndex);
  }

  getSemestres(programmeIndex: number, niveauIndex: number): FormArray {
    return this.getNiveaux(programmeIndex).at(niveauIndex).get('semestres') as FormArray;
  }

  addSemestre(programmeIndex: number, niveauIndex: number) {
    this.getSemestres(programmeIndex, niveauIndex).push(
      this.fb.group({
        numero: ['', Validators.required],
        nom: ['', Validators.required],
        ues: this.fb.array([]),
      })
    );
  }

  removeSemestre(programmeIndex: number, niveauIndex: number, semestreIndex: number) {
    this.getSemestres(programmeIndex, niveauIndex).removeAt(semestreIndex);
  }

  getUes(programmeIndex: number, niveauIndex: number, semestreIndex: number): FormArray {
    return this.getSemestres(programmeIndex, niveauIndex).at(semestreIndex).get('ues') as FormArray;
  }

  addUe(programmeIndex: number, niveauIndex: number, semestreIndex: number) {
    this.getUes(programmeIndex, niveauIndex, semestreIndex).push(
      this.fb.group({
        nom: ['', Validators.required],
        totalCredits: ['', Validators.required],
        modules: this.fb.array([]),
      })
    );
  }

  removeUe(programmeIndex: number, niveauIndex: number, semestreIndex: number, ueIndex: number) {
    this.getUes(programmeIndex, niveauIndex, semestreIndex).removeAt(ueIndex);
  }

  getModules(
    programmeIndex: number,
    niveauIndex: number,
    semestreIndex: number,
    ueIndex: number
  ): FormArray {
    return this.getUes(programmeIndex, niveauIndex, semestreIndex)
      .at(ueIndex)
      .get('modules') as FormArray;
  }

  addModule(programmeIndex: number, niveauIndex: number, semestreIndex: number, ueIndex: number) {
    this.getModules(programmeIndex, niveauIndex, semestreIndex, ueIndex).push(
      this.fb.group({
        nom: ['', Validators.required],
        cours: this.fb.array([]),
      })
    );
  }

  removeModule(
    programmeIndex: number,
    niveauIndex: number,
    semestreIndex: number,
    ueIndex: number,
    moduleIndex: number
  ) {
    this.getModules(programmeIndex, niveauIndex, semestreIndex, ueIndex).removeAt(moduleIndex);
  }

  getCours(
    programmeIndex: number,
    niveauIndex: number,
    semestreIndex: number,
    ueIndex: number,
    moduleIndex: number
  ): FormArray {
    return this.getModules(programmeIndex, niveauIndex, semestreIndex, ueIndex)
      .at(moduleIndex)
      .get('cours') as FormArray;
  }

  addCours(
    programmeIndex: number,
    niveauIndex: number,
    semestreIndex: number,
    ueIndex: number,
    moduleIndex: number
  ) {
    this.getCours(programmeIndex, niveauIndex, semestreIndex, ueIndex, moduleIndex).push(
      this.fb.group({
        nom: ['', Validators.required],
        code: ['', Validators.required],
        coefficient: [0, Validators.required],
        credits: [0, Validators.required],
        cm: [0],
        td: [0],
        totalHeures: [0, Validators.required],
      })
    );
  }

  removeCours(
    programmeIndex: number,
    niveauIndex: number,
    semestreIndex: number,
    ueIndex: number,
    moduleIndex: number,
    coursIndex: number
  ) {
    this.getCours(programmeIndex, niveauIndex, semestreIndex, ueIndex, moduleIndex).removeAt(
      coursIndex
    );
  }

  // ENVOI AU BACKEND
  saveFormation() {
    if (this.formationForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }

    this.formationEtudiantService.createFormation(this.formationForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Formation enregistrée avec succès !';
        this.showFormationForm = false;
        this.formationForm.reset();
        this.programmes.clear();
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de l'enregistrement de la formation.";
        console.error(err);
      },
    });
  }

  getDepartmentClass(code: string): string {
    const classes: any = {
      economie: 'eco-header',
      gestion: 'gestion-header',
      droit: 'droit-header',
    };
    return classes[code] || 'eco-header';
  }

  openProgrammeModal(departement: string, code: string): void {
    this.formationEtudiantService.getProgramme(departement, code).subscribe({
      next: (programme) => {
        this.selectedProgramme = programme;
        this.modalOpen = true;
      },
      error: () => {
        this.error = 'Erreur lors du chargement du programme';
      },
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedProgramme = null;
  }

  editFormation(departement: DepartementAvecFormations) {
    console.log('Modifier', departement);
    this.selectedDepartement = departement; // Formulaire pré-rempli si nécessaire
    this.showFormationForm = true;
  }

  // Méthode pour supprimer un département
  deleteFormation(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce département ?')) {
      this.formationEtudiantService.deleteFormation(id).subscribe({
        next: () => {
          this.loadData(); // Recharge la liste après suppression
        },
        error: (err: any) => console.error(err),
      });
    }
  }
}
