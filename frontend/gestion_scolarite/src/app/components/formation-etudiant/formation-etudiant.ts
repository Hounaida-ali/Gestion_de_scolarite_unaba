import { Component } from '@angular/core';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';
import { Programme } from '../../interfaces/ProgramInterface';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { CommonModule } from '@angular/common';
import { Program } from '../program/program';
import { RouterLink, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Departement } from '../../interfaces/departementInterface';
import { Formation } from '../../interfaces/formationInterface';

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
  selectedFormation: Formation | null = null;
  modalOpen = false;
  isLoading = false;
  error: string | null = null;

  showFormationForm = false;
  formationForm: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private formationEtudiantService: FormationEtudiantService) {
    this.formationForm = this.fb.group({
      _id: [''],
      nom: ['', Validators.required],
      departementId: ['', Validators.required],
      programmes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadData();
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
    this.selectedFormation = null;
    this.formationForm.reset();
    this.programmes.clear();
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
        niveau: ['', Validators.required],
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

  // ✅ MÉTHODE : Modifier une formation
  editFormation(formation: Formation): void {
    this.selectedFormation = formation;
    
    // Extraire le departementId selon le type (string ou objet Departement)
    let departementId = '';
    if (typeof formation.departement === 'string') {
      departementId = formation.departement;
    } else if (formation.departement && typeof formation.departement === 'object') {
      departementId = formation.departement._id || '';
    }
    
    // Pré-remplir le formulaire avec les données de la formation
    this.formationForm.patchValue({
      _id: formation._id,
      nom: formation.nom,
      departementId: departementId,
    });

    // Pré-remplir les programmes avec toute leur structure
    if (formation.programmes && formation.programmes.length > 0) {
      this.populateProgrammes(formation.programmes);
    } else {
      this.programmes.clear();
      this.addProgramme();
    }

    this.showFormationForm = true;
  }

  // ✅ HELPER : Pré-remplir les programmes avec toute leur structure
  private populateProgrammes(programmes: any[]): void {
    this.programmes.clear();
    
    programmes.forEach((prog: any) => {
      const programmeGroup = this.fb.group({
        departement: [prog.departement || '', Validators.required],
        code: [prog.code || '', Validators.required],
        nom: [prog.nom || '', Validators.required],
        description: [prog.description || ''],
        duree: [prog.duree || ''],
        credits: [prog.credits || ''],
        diplome: [prog.diplome || ''],
        acces: [prog.acces || ''],
        niveaux: this.fb.array([]),
      });

      // Ajouter les niveaux
      if (prog.niveaux && prog.niveaux.length > 0) {
        const niveauxArray = programmeGroup.get('niveaux') as FormArray;
        prog.niveaux.forEach((niveau: any) => {
          const niveauGroup = this.fb.group({
            code: [niveau.code || '', Validators.required],
            nom: [niveau.nom || '', Validators.required],
            description: [niveau.description || ''],
            semestres: this.fb.array([]),
          });

          // Ajouter les semestres
          if (niveau.semestres && niveau.semestres.length > 0) {
            const semestresArray = niveauGroup.get('semestres') as FormArray;
            niveau.semestres.forEach((semestre: any) => {
              const semestreGroup = this.fb.group({
                numero: [semestre.numero || '', Validators.required],
                nom: [semestre.nom || '', Validators.required],
                ues: this.fb.array([]),
              });

              // Ajouter les UEs
              if (semestre.ues && semestre.ues.length > 0) {
                const uesArray = semestreGroup.get('ues') as FormArray;
                semestre.ues.forEach((ue: any) => {
                  const ueGroup = this.fb.group({
                    nom: [ue.nom || '', Validators.required],
                    totalCredits: [ue.totalCredits || '', Validators.required],
                    modules: this.fb.array([]),
                  });

                  // Ajouter les modules
                  if (ue.modules && ue.modules.length > 0) {
                    const modulesArray = ueGroup.get('modules') as FormArray;
                    ue.modules.forEach((module: any) => {
                      const moduleGroup = this.fb.group({
                        nom: [module.nom || '', Validators.required],
                        cours: this.fb.array([]),
                      });

                      // Ajouter les cours
                      if (module.cours && module.cours.length > 0) {
                        const coursArray = moduleGroup.get('cours') as FormArray;
                        module.cours.forEach((cours: any) => {
                          const coursGroup = this.fb.group({
                            nom: [cours.nom || '', Validators.required],
                            code: [cours.code || '', Validators.required],
                            coefficient: [cours.coefficient || 0, Validators.required],
                            credits: [cours.credits || 0, Validators.required],
                            cm: [cours.cm || 0],
                            td: [cours.td || 0],
                            totalHeures: [cours.totalHeures || 0, Validators.required],
                            niveau: [cours.niveau || '', Validators.required],
                          });
                          coursArray.push(coursGroup);
                        });
                      }

                      modulesArray.push(moduleGroup);
                    });
                  }

                  uesArray.push(ueGroup);
                });
              }

              semestresArray.push(semestreGroup);
            });
          }

          niveauxArray.push(niveauGroup);
        });
      }

      this.programmes.push(programmeGroup);
    });
  }

  // ✅ MÉTHODE : Enregistrer (création ou mise à jour)
  saveFormation() {
    if (this.formationForm.invalid) {
      this.showMessage('Veuillez remplir tous les champs requis.', 'error');
      return;
    }

    const formData = this.formationForm.value;
    const isUpdate = !!formData._id;

    if (isUpdate) {
      // MISE À JOUR
      this.formationEtudiantService.updateFormation(formData._id, formData).subscribe({
        next: (res: any) => {
          const message = res?.message ?? 'Formation mise à jour avec succès !';
          
          this.showFormationForm = false;
          this.formationForm.reset();
          this.programmes.clear();
          this.selectedFormation = null;
          
          this.showMessage(message, 'success');
          this.loadData();
        },
        error: (err: any) => {
          const message = err?.error?.message ?? 'Erreur lors de la mise à jour';
          this.showMessage(message, 'error');
          console.error('Erreur Backend :', err);
        }
      });
    } else {
      // CRÉATION
      this.formationEtudiantService.createFormation(formData).subscribe({
        next: (res: any) => {
          const message = res?.message ?? 'Formation enregistrée avec succès !';
          
          this.showFormationForm = false;
          this.formationForm.reset();
          this.programmes.clear();
          
          this.showMessage(message, 'success');
          this.loadData();
        },
        error: (err: any) => {
          const message = err?.error?.message ?? "Erreur lors de l'enregistrement";
          this.showMessage(message, 'error');
          console.error('Erreur Backend :', err);
        }
      });
    }
  }

  // ✅ MÉTHODE : Supprimer une formation
  deleteFormation(formation: Formation, departementId: string): void {
    if (!formation._id) return;
    
    if (!confirm(`Voulez-vous vraiment supprimer la formation "${formation.nom}" ?`)) return;

    this.formationEtudiantService.deleteFormation(formation._id).subscribe({
      next: (res: any) => {
        const success = res.success !== false;
        const message = res?.message ?? 'Formation supprimée avec succès';
        
        this.showMessage(message, success ? 'success' : 'error');
        
        if (success) {
          const dept = this.departements.find(d => d._id === departementId);
          if (dept) {
            dept.formations = dept.formations.filter(f => f._id !== formation._id);
          }
        }
      },
      error: (err: any) => {
        const message = err?.error?.message ?? 'Erreur lors de la suppression';
        this.showMessage(message, 'error');
        console.error('Erreur suppression :', err);
      },
    });
  }

  // ✅ MÉTHODE : Annuler le formulaire
  cancelForm(): void {
    this.showFormationForm = false;
    this.formationForm.reset();
    this.programmes.clear();
    this.selectedFormation = null;
  }

  // ✅ MÉTHODE : Afficher les messages
  showMessage(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = null;
      setTimeout(() => (this.successMessage = null), 3000);
    } else {
      this.errorMessage = message;
      this.successMessage = null;
      setTimeout(() => (this.errorMessage = null), 3000);
    }
  }

  getDepartmentClass(code: string): string {
    const classes: any = {
      economie: 'eco-header',
      gestion: 'gestion-header',
      droit: 'droit-header',
    };
    return classes[code] || 'eco-header';
  }

  openProgrammeModal(departementId: string, code: string): void {
    if (!departementId) return;

    this.formationEtudiantService.getProgramme(departementId, code).subscribe({
      next: (programme) => {
        this.selectedProgramme = programme;
        this.modalOpen = true;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du programme';
      },
    });
  }

  getDepartementId(departement: string | Departement): string {
    if (typeof departement === 'string') return departement;
    return departement._id ?? '';
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedProgramme = null;
  }
}