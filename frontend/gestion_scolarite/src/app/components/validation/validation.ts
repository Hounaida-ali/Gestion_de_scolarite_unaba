import { Component } from '@angular/core';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../../services/etudiant-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-validation',
  imports: [CommonModule],
  templateUrl: './validation.html',
  styleUrl: './validation.css',
  providers: [DatePipe],
})
export class Validation {
  etudiant: Etudiant | null = null;
  etudiantId: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Garder private mais utiliser dans les méthodes
    private etudiantService: EtudiantService,
    private datePipe: DatePipe // Injecter DatePipe
  ) {}

  ngOnInit(): void {
    this.etudiantId = this.route.snapshot.paramMap.get('id') || '';
    if (this.etudiantId) {
      this.chargerEtudiant(this.etudiantId);
    }
  }

   chargerEtudiant(id: string) {
    this.etudiantService.getEtudiant(id).subscribe({
      next: (response: any) => {
        this.etudiant = response;
        console.log('Étudiant chargé:', this.etudiant);
      },
      error: (error) => {
        console.error('Erreur chargement étudiant:', error);
      }
    });
  }

  
   simulerValidation(): void {
    if (this.etudiantId) {
      this.etudiantService.validerInscription(this.etudiantId).subscribe({
        next: (etudiant) => {
          this.etudiant = etudiant;
          this.naviguerVersPaiement();
        },
        error: (error) => {
          console.error('Erreur lors de la validation:', error);
        }
      });
    }
  }

  // Méthode pour naviguer vers le paiement
   naviguerVersPaiement(): void {
    if (this.etudiant && this.etudiant._id) {
      this.router.navigate(['/paiement', this.etudiant._id]);
    } else {
      console.error('Impossible de naviguer vers le paiement: étudiant ou ID manquant');
    }
  }

  // Méthode pour formater la date
  formaterDate(date?: string | Date): string {
  if (!date) return 'Non définie';
  return this.datePipe.transform(date, 'dd/MM/yyyy à HH:mm') || 'Date invalide';
}


  // Méthodes d'helper avec gestion de null
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

  getDepartementLabel(departementValue: string | undefined): string {
  if (!departementValue) return 'Non spécifié';

  const departements: { [key: string]: string } = {
    'économie': 'Économie',
    'droit': 'Droit', 
    'gestion': 'Gestion'
  };
  return departements[departementValue] || departementValue;
}

  getModeFormationLabel(modeValue: string | undefined): string {
    if (!modeValue) return 'Non spécifié';

    const modes: { [key: string]: string } = {
      presentiel: 'Présentiel',
      'en-ligne': 'En ligne',
    };
    return modes[modeValue] || modeValue;
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

  getDocumentLabel(docValue: string | undefined): string {
    if (!docValue) return 'Document inconnu';

    const documents: { [key: string]: string } = {
      cv: 'Curriculum Vitae',
      'lettre-motivation': 'Lettre de motivation',
      'releves-notes': 'Relevés de notes',
      diplome: 'Copie du diplôme',
    };
    return documents[docValue] || docValue;
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
}
