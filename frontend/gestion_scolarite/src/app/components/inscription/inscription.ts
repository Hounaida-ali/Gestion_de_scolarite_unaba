import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EtudiantService } from '../../services/etudiant-service';
import { Router } from '@angular/router';
import { CreationEtudiantResponse, Etudiant } from '../../interfaces/EtudiantInterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  etapeActuelle = 1;
  etudiantForm: FormGroup;
  formationForm: FormGroup;
  etudiantId: string | null = null;
  photoFile: File | null = null;
  photoPreview: string | null = null;

  successMessage: string = '';
  errorMessage: string = '';

  niveauxEtudes = [
    { value: 'bac', label: 'Baccalauréat' },
    { value: 'bac1', label: 'Bac+1' },
    { value: 'bac2', label: 'Bac+2' },
    { value: 'bac3', label: 'Bac+3' },
    { value: 'bac4', label: 'Bac+4' },
    { value: 'bac5', label: 'Bac+5' },
  ];

  departements = [
    { value: 'économie', label: 'Économie' },
    { value: 'droit', label: 'Droit' },
    { value: 'gestion', label: 'Gestion' },
  ];

  formations = [
    { value: 'informatique', label: 'Licence Informatique' },
    { value: 'gestion', label: 'Licence Gestion' },
    { value: 'droit', label: 'Licence Droit' },
    { value: 'psychologie', label: 'Licence Psychologie' },
    { value: 'master-info', label: 'Master Informatique' },
    { value: 'master-gestion', label: 'Master Management' },
  ];

  documents = [
    { value: 'cv', label: 'Curriculum Vitae' },
    { value: 'lettre-motivation', label: 'Lettre de motivation' },
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

    this.formationForm = this.fb.group({
      niveauEtudes: ['', Validators.required],
      departement: ['', Validators.required],
      formation: ['', Validators.required],
      modeFormation: ['presentiel', Validators.required],
      documents: [[]],
    });
  }

  ngOnInit(): void {}

  suivant(): void {
    if (this.etapeActuelle === 1 && this.etudiantForm.valid) {
      this.etapeActuelle = 2;
    } else if (this.etapeActuelle === 2 && this.formationForm.valid) {
      this.soumettreInscription();
    }
  }

  precedent(): void {
    if (this.etapeActuelle === 2) {
      this.etapeActuelle = 1;
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification de la taille (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 2MB');
        return;
      }

      // Vérification du type
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Seuls les formats JPG et PNG sont acceptés');
        return;
      }

      this.photoFile = file;

      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  soumettreInscription(): void {
    if (this.etudiantForm.valid && this.formationForm.valid) {
      // Préparer les données de l'étudiant
      const etudiantData: any = {
        ...this.etudiantForm.value,
        ...this.formationForm.value,
        statut: 'en-attente',
        fraisInscription: 50000,
        documents: this.formationForm.value.documents || [],
      };

      console.log('Données envoyées:', etudiantData);

      // --- Étape 1 : Vérifier si une photo a été sélectionnée ---
      if (this.photoFile) {
        const formData = new FormData();
        formData.append('file', this.photoFile!);

        // --- Étape 2 : Upload de la photo ---
        this.etudiantService.uploadPhoto(formData).subscribe({
          next: (response: any) => {
            console.log('Photo uploadée avec succès:', response);

            // Corriger le chemin pour qu'il soit accessible depuis le navigateur
            const relativeUrl = response.file.url.replace('public/', '');
            etudiantData.photoEtudiant = `http://localhost:5000/${relativeUrl}`;

            // --- Étape 3 : Créer l'étudiant avec la photo ---
            this.etudiantService.creerEtudiant(etudiantData).subscribe({
              next: (response: any) => {
                console.log('Réponse complète du serveur:', response);

                const etudiantId = response.etudiant?._id;
                if (etudiantId) {
                  this.showMessage(response.message || 'Inscription réussie !', 'success', 5000);
                  console.log('Navigation vers validation avec ID:', etudiantId);
                  this.router.navigate(['/validation', etudiantId]);
                } else {
                  console.error('ID étudiant manquant dans la réponse:', response);
                  this.showMessage(
                    "Erreur : Impossible de récupérer l'ID de l'étudiant",
                    'error',
                    5000
                  );
                }
              },
              error: (error) => {
                console.error("Erreur lors de l'inscription:", error);
                const msg = error.error?.message || 'Veuillez vérifier vos informations';
                this.showMessage(msg, 'error', 5000);
              },
            });
          },
          error: (error) => {
            console.error('Erreur upload photo:', error);
            this.showMessage("Erreur lors de l'upload de la photo", 'error', 5000);
          },
        });
      } else {
        // --- Si aucune photo n'est sélectionnée ---
        this.etudiantService.creerEtudiant(etudiantData).subscribe({
          next: (response: any) => {
            console.log('Réponse complète du serveur:', response);

            const etudiantId = response.etudiant?._id;
            if (etudiantId) {
              this.showMessage(response.message || 'Inscription réussie !', 'success', 5000);
              console.log('Navigation vers validation avec ID:', etudiantId);
              this.router.navigate(['/validation', etudiantId]);
            } else {
              console.error('ID étudiant manquant dans la réponse:', response);
              this.showMessage(
                "Erreur : Impossible de récupérer l'ID de l'étudiant",
                'error',
                5000
              );
            }
          },
          error: (error) => {
            console.error("Erreur lors de l'inscription:", error);
            const msg = error.error?.message || 'Veuillez vérifier vos informations';
            this.showMessage(msg, 'error', 5000);
          },
        });
      }
    } else {
      // --- Si le formulaire n'est pas valide ---
      console.log('Formulaire invalide');
      this.markFormGroupTouched(this.etudiantForm);
      this.markFormGroupTouched(this.formationForm);
      this.showMessage(
        'Veuillez remplir correctement tous les champs du formulaire.',
        'error',
        5000
      );
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), duration);
    } else {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), duration);
    }
  }

  onDocumentChange(document: string, event: any): void {
    const documents = this.formationForm.get('documents')?.value || [];
    if (event.target.checked) {
      documents.push(document);
    } else {
      const index = documents.indexOf(document);
      if (index > -1) {
        documents.splice(index, 1);
      }
    }
    this.formationForm.patchValue({ documents });
  }
}
