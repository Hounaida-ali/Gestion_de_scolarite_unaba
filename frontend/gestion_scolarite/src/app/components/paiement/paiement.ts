import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../../services/etudiant-service';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, FormsModule],
  templateUrl: './paiement.html',
  styleUrl: './paiement.css',
})
export class Paiement {
  etudiant: Etudiant | null = null;
  nomDepartement: string = '';
  nomFormation: string = '';
  etudiantId: string = '';
  methodePaiement: string = '';
  formulaireCarte: any = {
    numeroCarte: '',
    titulaire: '',
    expiration: '',
    cvv: '',
  };
  referenceVirement: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etudiantService: EtudiantService,
    private formationEtudiantService: FormationEtudiantService
  ) {}

  ngOnInit(): void {
    this.etudiantId = this.route.snapshot.paramMap.get('id') || '';
    this.chargerEtudiant();
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.etudiantService.getEtudiant(id).subscribe((etudiant: Etudiant) => {
        this.etudiant = etudiant;

        // Charger le département et la formation via FormationEtudiantService
        this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
          next: (departements: DepartementAvecFormations[]) => {
            const dep = departements.find((d) => d._id === etudiant.departement);
            this.nomDepartement = dep?.nom || 'Non trouvé';

            if (dep) {
              const form = dep.formations.find((f) => f._id === etudiant.formation);
              this.nomFormation = form?.nom || 'Non trouvé';
            }
          },
          error: () => console.error('Erreur chargement départements/formations'),
        });
      });
    });
  }

  chargerEtudiant(): void {
    this.etudiantService.getEtudiant(this.etudiantId).subscribe({
      next: (etudiant) => {
        this.etudiant = etudiant;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
      },
    });
  }

  selectionnerMethode(methode: string): void {
    this.methodePaiement = methode;
  }

  traiterPaiement(): void {
    // Simulation de traitement de paiement
    this.etudiantService.confirmerPaiement(this.etudiantId).subscribe({
      next: (etudiant) => {
        this.router.navigate(['/confirmation', etudiant._id]);
      },
      error: (error) => {
        console.error('Erreur lors du paiement:', error);
      },
    });
  }

  retourValidation(): void {
    this.router.navigate(['/validation', this.etudiantId]);
  }

  formulaireValide(): boolean {
    if (!this.methodePaiement) return false;

    if (this.methodePaiement === 'card') {
      return (
        this.formulaireCarte.numeroCarte?.length >= 16 &&
        this.formulaireCarte.titulaire?.length > 0 &&
        this.formulaireCarte.expiration?.length === 5 &&
        this.formulaireCarte.cvv?.length === 3
      );
    } else if (this.methodePaiement === 'transfer') {
      return this.referenceVirement?.length > 0;
    }

    return false;
  }

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
}
