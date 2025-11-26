import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EtudiantService } from '../../services/etudiant-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';
import { Formation } from '../../interfaces/formationInterface';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {
  etapeActuelle = 1;
  etudiantForm: FormGroup;
  photoFile: File | null = null;
  photoPreview: string | null = null;
  selectedDocs: { [key: string]: File } = {};
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  // Données brutes
  departements: DepartementAvecFormations[] = [];
  formations: Formation[] = [];
  // Données filtrées
  formFilieres: any[] = []; // Filières filtrées par département
  formNiveaux: string[] = []; // Niveaux filtrés par filière

  // Sélection du formulaire étape 2
  selectedCourse = {
    departement: '',
    filiere: '',
    niveau: '',
    modeFormation: 'presentiel',
  };

  documents = [
    { value: 'demande-manuscrite', label: 'Demande manuscrite' },
    { value: 'releves-notes', label: 'Relevés de notes' },
    { value: 'diplome', label: 'Copie du diplôme' },
  ];

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private router: Router
  ) {
    this.etudiantForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    // Charger les départements
    this.etudiantService.getDepartements().subscribe({
      next: (data) => {
        this.departements = data;
        console.log('Départements chargés:', data);
      },
      error: (err) => console.error('Erreur départements:', err),
    });

    // Charger les formations/filières
    this.etudiantService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        console.log('Formations chargées:', data);
      },
      error: (err) => console.error('Erreur formations:', err),
    });
  }

  // Quand le DÉPARTEMENT change
  // 🔹 Quand le DÉPARTEMENT change
  onFormDepartementChange(): void {
    console.log('Département sélectionné:', this.selectedCourse.departement);

    // Reset filière et niveau
    this.selectedCourse.filiere = '';
    this.selectedCourse.niveau = '';
    this.formFilieres = [];
    this.formNiveaux = [];

    if (!this.selectedCourse.departement) return;

    // Filtrer les filières par département
    this.formFilieres = this.formations.filter((f) => {
      // Si departement est un objet avec _id, sinon juste l'ID
      const depId = typeof f.departement === 'string' ? f.departement : f.departement?._id;
      return depId === this.selectedCourse.departement;
    });

    console.log('Filières filtrées:', this.formFilieres);

    // Si aucune filière trouvée, fallback optionnel
    if (this.formFilieres.length === 0) {
      console.warn('Aucune filière trouvée pour ce département');
    }
  }

  // 🔹 Quand la FILIÈRE change
  onFormFiliereChange(): void {
    console.log('Filière sélectionnée:', this.selectedCourse.filiere);

    // Reset niveau
    this.selectedCourse.niveau = '';
    this.formNiveaux = [];

    if (!this.selectedCourse.filiere) return;

    // Trouver la filière sélectionnée
    const filiereSelectionnee = this.formFilieres.find(
      (f) => f._id === this.selectedCourse.filiere
    );

    if (!filiereSelectionnee) return;

    const niveauxSet = new Set<string>();

    // Si la filière a des niveaux directs
    if (filiereSelectionnee.niveaux && Array.isArray(filiereSelectionnee.niveaux)) {
      filiereSelectionnee.niveaux.forEach((n: any) => {
        if (typeof n === 'string') niveauxSet.add(n);
        else if (n.nom) niveauxSet.add(n.nom);
      });
    }
    // Sinon, vérifier les programmes avec niveaux
    else if (filiereSelectionnee.programmes && Array.isArray(filiereSelectionnee.programmes)) {
      filiereSelectionnee.programmes.forEach((p: any) => {
        if (Array.isArray(p.niveaux)) {
          p.niveaux.forEach((n: any) => {
            if (n.nom) niveauxSet.add(n.nom);
          });
        } else if (p.niveau) {
          niveauxSet.add(p.niveau);
        }
      });
    }

    // Fallback si aucun niveau trouvé
    this.formNiveaux =
      niveauxSet.size > 0 ? Array.from(niveauxSet) : ['L1', 'L2', 'L3', 'M1', 'M2'];

    console.log('Niveaux disponibles:', this.formNiveaux);
  }

  // Vérifier si le formulaire étape 2 est valide
  isFormationFormValid(): boolean {
    return !!(
      this.selectedCourse.departement &&
      this.selectedCourse.filiere &&
      this.selectedCourse.niveau &&
      this.selectedCourse.modeFormation
    );
  }

  // Obtenir le nom du département
  getDepartementNom(): string {
    const dep = this.departements.find((d) => d._id === this.selectedCourse.departement);
    return dep?.nom || '';
  }

  // Obtenir le nom de la filière
  getFiliereNom(): string {
    const filiere = this.formations.find((f) => f._id === this.selectedCourse.filiere);
    return filiere?.nom || '';
  }

  allerAEtape(etape: number): void {
    if (etape >= 1 && etape <= 5) {
      this.etapeActuelle = etape;
    }
  }

  suivant(): void {
    if (this.etapeActuelle === 1) {
      if (this.etudiantForm.valid) {
        this.etapeActuelle = 2;
      } else {
        this.markFormGroupTouched(this.etudiantForm);
        this.showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
      }
    } else if (this.etapeActuelle === 2) {
      if (this.isFormationFormValid()) {
        this.soumettreInscription();
      } else {
        this.showMessage('Veuillez sélectionner département, filière et niveau.', 'error');
      }
    }
  }

  precedent(): void {
    if (this.etapeActuelle > 1) {
      this.etapeActuelle--;
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.showMessage('La photo ne doit pas dépasser 2MB', 'error');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.showMessage('Format accepté: JPG ou PNG', 'error');
      return;
    }

    this.photoFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => (this.photoPreview = e.target.result);
    reader.readAsDataURL(file);
  }

  onDocumentSelected(docKey: string, event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('Le fichier ne doit pas dépasser 5MB', 'error');
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      this.showMessage('Format accepté: PDF, JPG ou PNG', 'error');
      return;
    }

    this.selectedDocs[docKey] = file;
  }

  soumettreInscription(): void {
  this.isLoading = true;

  // Construire les données de l'étudiant
  const data: any = {
    ...this.etudiantForm.value,
    departement: this.selectedCourse.departement,
    formation: this.selectedCourse.filiere,
    niveau: this.selectedCourse.niveau,
    modeFormation: this.selectedCourse.modeFormation,
  };

  console.log('Données à envoyer:', data);

  // Si aucune photo ni document sélectionné, on crée directement l'étudiant
  if (!this.photoFile && Object.keys(this.selectedDocs).length === 0) {
    this.creerEtudiant(data);
    return;
  }

  const formData = new FormData();

  // Ajouter la photo
  if (this.photoFile) {
    formData.append('photoEtudiant', this.photoFile);
  }

  // Ajouter les documents
  Object.keys(this.selectedDocs).forEach((key) => {
    formData.append('documents', this.selectedDocs[key]);
  });

  // ⚡ Utilisation de uploadFiles et typage explicite
  this.etudiantService.uploadFiles(formData).subscribe({
    next: (res: { photo?: any; documents?: any[] }) => {
      console.log('Fichiers uploadés:', res);

      // Ajouter la photo
      if (res.photo?.url) {
        data.photoEtudiant = `http://localhost:5000${res.photo.url}`;
      }

      // Ajouter les documents
      if (res.documents?.length) {
        data.documents = res.documents.map((d: any) => ({          
          filename: d.url.split("uploads/")[1],
          originalName: d.nom,
          path: d.path,
          url: `http://localhost:5000${d.url}`,
          taille: d.taille,
          type: d.type,
        }));
      }
      console.log("Inscrirption - data :", data);
      

      this.creerEtudiant(data);
    },
    error: (err: any) => {
      console.error('Erreur upload:', err);
      this.creerEtudiant(data);
    },
  });
}


  private creerEtudiant(data: any): void {
    this.etudiantService.creerEtudiant(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Inscription réussie:', res);
        this.showMessage(res.message || 'Inscription réussie!', 'success');

        const id = res.etudiant?._id;
        if (id) {
          setTimeout(() => this.router.navigate(['/validation', id]), 2000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur inscription:', err);
        this.showMessage(err.error?.message || "Erreur lors de l'inscription", 'error');
      },
    });
  }

  private markFormGroupTouched(fg: FormGroup): void {
    Object.keys(fg.controls).forEach((key) => {
      const ctrl = fg.get(key);
      ctrl?.markAsTouched();
      if (ctrl instanceof FormGroup) this.markFormGroupTouched(ctrl);
    });
  }

  showMessage(msg: string, type: 'success' | 'error', duration = 5000): void {
    if (type === 'success') {
      this.successMessage = msg;
      this.errorMessage = '';
    } else {
      this.errorMessage = msg;
      this.successMessage = '';
    }
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, duration);
  }
}
