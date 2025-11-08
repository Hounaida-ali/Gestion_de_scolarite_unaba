import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { EtudiantService } from '../../services/etudiant-service';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  etudiant: Etudiant | null = null;
  etudiantId: string = '';
  photoUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etudiantService: EtudiantService
  ) {}

  ngOnInit(): void {
    this.etudiantId = this.route.snapshot.paramMap.get('id') || '';
    this.chargerEtudiant();
  }

  chargerEtudiant(): void {
    this.etudiantService.getEtudiant(this.etudiantId).subscribe({
      next: (etudiant: any) => {
        this.etudiant = etudiant;

        // Récupérer l'URL de la photo
        if (this.etudiant?.photo?.url) {
          this.photoUrl = this.etudiant.photo.url.replace(
            'http://localhost:5000//',
            'http://localhost:5000/'
          );
          console.log('URL photo corrigée:', this.photoUrl);
        } else if (this.etudiant?.photoEtudiant) {
          this.photoUrl = this.etudiant.photoEtudiant;
          console.log('URL photo depuis photoEtudiant:', this.photoUrl);
        } else {
          console.log('Aucune photo trouvée pour cet étudiant:', this.etudiant);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
      },
    });
  }

  // AJOUTER getDateFinAnnee()

  onImageError() {
    console.error("Erreur de chargement de l'image");
    this.photoUrl = '';
  }

  nouvelleInscription() {
    this.router.navigate(['/inscription']);
  }

 telechargerAttestation(): void {
  // Créer un nouveau PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Contenu de l'attestation
  const today = new Date().toLocaleDateString('fr-FR');
  const contenu = `
    ATTESTATION D'INSCRIPTION

    Je soussigné(e), Responsable des inscriptions de l'Université Internationale,
    atteste que :

    Nom : ${this.etudiant?.nom?.toUpperCase()}
    Prénom : ${this.etudiant?.prenom}
    Numéro étudiant : ${this.etudiant?.numeroEtudiant || this.etudiant?.idProvisoire}
    Formation : ${this.getFormationLabel(this.etudiant?.formation)}
    Département : ${this.getDepartementLabel(this.etudiant?.departement)}
    Mode : ${this.getModeFormationLabel(this.etudiant?.modeFormation)}
    Niveau : ${this.etudiant?.niveauEtudes}

    est régulièrement inscrit(e) pour l'année académique ${new Date().getFullYear()}/${new Date().getFullYear() + 1}.

    L'attestation est valable jusqu'au : ${this.getDateFinAnnee()}

    Fait à l'Université Internationale, le ${today}

    Cachet et signature
  `;

  // Configurer le PDF
  pdf.setFontSize(16);
  pdf.text('ATTESTATION D\'INSCRIPTION', 105, 20, { align: 'center' });
  
  pdf.setFontSize(10);
  const lines = pdf.splitTextToSize(contenu, 180);
  pdf.text(lines, 15, 40);

  // Ajouter un cadre
  pdf.rect(10, 10, 190, 277); // Cadre A4

  // Télécharger le PDF
  pdf.save(`attestation-${this.etudiant?.nom}-${this.etudiant?.prenom}.pdf`);
}
  getDepartementLabel(departementValue: string | undefined): string {
    if (!departementValue) return 'Non spécifié';

    const departements: { [key: string]: string } = {
      économie: 'Économie',
      droit: 'Droit',
      gestion: 'Gestion',
    };
    return departements[departementValue] || departementValue;
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

  formaterDate(date: string | Date | undefined): string {
    if (!date) return 'Date non disponible';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  getDateFinAnnee(): string {
    const now = new Date();
    const finAnnee = new Date(now.getFullYear() + 1, 6, 31); // 31 juillet de l'année prochaine
    return finAnnee.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
