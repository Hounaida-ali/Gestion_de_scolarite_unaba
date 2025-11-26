import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { EtudiantService } from '../../services/etudiant-service';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  etudiant: Etudiant | null = null;
  nomDepartement: string = '';
  nomFormation: string = '';
  etudiantId: string = '';
  photoUrl: string = '';

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
  telechargercarte(): void {
    const element = document.querySelector('.student-card') as HTMLElement;

    if (!element) {
      console.error('Impossible de trouver la carte étudiant à imprimer.');
      return;
    }

    html2canvas(element, {
      scale: 3, // haute résolution
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Taille A4 (portrait)
      const pageWidth = 210;
      const pageHeight = 297;

      // 🔹 Réduction de la carte à ~60 % de la largeur de la page A4
      const imgWidth = 130; // <--- ajuster cette valeur selon ton besoin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 🔹 Centrage sur la page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`carte-${this.etudiant?.nom}-${this.etudiant?.prenom}.pdf`);
    });
  }

  formaterDateNaissance(date: string | Date | undefined): string {
    if (!date) return 'Non spécifié';

    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    return dateObj.toLocaleDateString('fr-FR', options);
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
    const doc = new jsPDF();

    const contenu = `
UNIVERSITÉ INTERNATIONALE
ATTESTATION D'INSCRIPTION

Je soussigné(e), Responsable des inscriptions de l'Université Internationale,
atteste que :

Nom : ${this.etudiant?.nom?.toUpperCase()}
Prénom : ${this.etudiant?.prenom}
Numéro étudiant : ${this.etudiant?.numeroEtudiant || this.etudiant?.idProvisoire}
Formation : ${this.getFormationLabel(this.etudiant?.formation)}
Département : ${this.getDepartementLabel(this.etudiant?.departement)}
Mode : ${this.getModeFormationLabel(this.etudiant?.modeFormation)}
Niveau : ${this.etudiant?.niveau}


est régulièrement inscrit(e) pour l'année académique ${new Date().getFullYear()}/${
      new Date().getFullYear() + 1
    }.

Valable jusqu'au : ${this.getDateFinAnnee()}

Fait à l'Université Internationale, le ${new Date().toLocaleDateString('fr-FR')}

Cachet et signature
  `;

    // Ajouter le texte au PDF
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(contenu, 10, 10);

    // Télécharger le PDF
    doc.save(`attestation-${this.etudiant?.nom}-${this.etudiant?.prenom}.pdf`);
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
      // hour: '2-digit',
      // minute: '2-digit',
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
