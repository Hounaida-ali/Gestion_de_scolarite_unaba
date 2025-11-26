import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { Etudiant } from '../../interfaces/EtudiantInterface';
import { DepartementService } from '../../services/departement-service';
import { CommonModule } from '@angular/common';
// import { DepartementService } from '../../services/departement.service';

Chart.register(...registerables);

@Component({
  selector: 'app-statistiques-graphiques',
  templateUrl: './statistiques-graphiques.html',
   standalone: true, 
  styleUrl: './statistiques-graphiques.css',
   imports: [CommonModule]
})
export class StatistiquesGraphiques implements OnChanges, AfterViewInit, OnDestroy {

  @Input() etudiants: Etudiant[] = [];

  @ViewChild('evolutionChart') evolutionChartRef!: ElementRef;
  @ViewChild('departementChart') departementChartRef!: ElementRef;

  private evolutionChart?: Chart;
  private departementChart?: Chart;

  departements: { _id: string, nom: string }[] = [];

  constructor(private departementService: DepartementService) {}

  // ⭐ Charger les départements AVANT de créer les graphiques
  ngAfterViewInit(): void {
    this.departementService.getAll().subscribe({
      next: (data: any[]) => {
        this.departements = data;
        this.createCharts();
      },
      error: (err) => {
        console.error("Erreur récupération départements :", err);
        this.createCharts(); // on crée les graphiques même sans départements
      }
    });
  }

  ngOnChanges(): void {
    this.updateCharts();
  }

  private getEtudiantsPayes(): Etudiant[] {
    return this.etudiants.filter(e => e.statut === 'paye' || e.statut === 'PXE');
  }

  // ⭐ Convertir ID -> nom du département
  private getDepartementName(id: string): string {
    const dept = this.departements.find(d => d._id === id);
    return dept ? dept.nom : "Non spécifié";
  }

  private createCharts(): void {
    this.createEvolutionChart();
    this.createDepartementChart();
  }

  private createEvolutionChart(): void {
    if (!this.evolutionChartRef) return;

    this.evolutionChart?.destroy();

    const data = this.calculerEvolutionMensuelle();

    this.evolutionChart = new Chart(this.evolutionChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.mois,
        datasets: [{
          label: 'Inscriptions mensuelles',
          data: data.inscriptions,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52,152,219,0.1)',
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  private createDepartementChart(): void {
  if (!this.departementChartRef?.nativeElement) {
    console.error('Canvas departementChart non trouvé');
    return;
  }

  // Détruire le graphique existant
  if (this.departementChart) {
    this.departementChart.destroy();
  }

  const data = this.calculerRepartitionDepartements();
  console.log('Données départements:', data);

  // Définir les couleurs fixes pour chaque département
  const couleurDepartements: { [key: string]: string } = {
    'Département de Science Economique': '#3498db',  // Bleu
    'Département de Droit': '#e74c3c',             // Rouge
    'Département de Gestion': '#2ecc71'            // Vert
  };

  // Appliquer les couleurs aux départements dynamiquement
  const backgroundColors = data.departements.map(dep => couleurDepartements[dep] || '#f39c12'); // Orange par défaut

  // Vérification longueur
  if (backgroundColors.length !== data.effectifs.length) {
    console.warn('Mismatch couleurs / effectifs', backgroundColors, data.effectifs);
  }

  try {
    this.departementChart = new Chart(this.departementChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.departements,
        datasets: [{
          data: data.effectifs,
          backgroundColor: backgroundColors,
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Répartition des étudiants par département',
            font: { size: 16, weight: 'bold' }
          },
          legend: { display: true, position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} étudiants (${percentage}%)`;
              }
            }
          }
        },
        cutout: '50%'
      }
    });
    console.log('Graphique département créé avec succès');
  } catch (error) {
    console.error('Erreur création graphique département:', error);
  }
}

  private calculerEvolutionMensuelle() {
    const map = new Map<string, number>();

    this.getEtudiantsPayes().forEach(et => {
      if (!et.dateInscription) return;

      const date = new Date(et.dateInscription ?? '');

      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        map.set(key, (map.get(key) || 0) + 1);
      }
    });

    const entries = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

    return {
      mois: entries.map(([k]) => k),
      inscriptions: entries.map(([_, v]) => v)
    };
  }

  private calculerRepartitionDepartements() {
  const map = new Map<string, number>();

  // 🔹 On ne prend que les étudiants payés
  this.getEtudiantsPayes().forEach(et => {
    const deptNom = this.getDepartementName(et.departement);
    map.set(deptNom, (map.get(deptNom) || 0) + 1);
  });

  return {
    departements: Array.from(map.keys()),
    effectifs: Array.from(map.values())
  };
}


  private updateCharts(): void {
    if (this.evolutionChart) {
      const data = this.calculerEvolutionMensuelle();
      this.evolutionChart.data.labels = data.mois;
      this.evolutionChart.data.datasets[0].data = data.inscriptions;
      this.evolutionChart.update();
    }

    if (this.departementChart) {
      const data = this.calculerRepartitionDepartements();
      this.departementChart.data.labels = data.departements;
      this.departementChart.data.datasets[0].data = data.effectifs;
      this.departementChart.update();
    }
  }

  ngOnDestroy(): void {
    this.evolutionChart?.destroy();
    this.departementChart?.destroy();
  }
}
