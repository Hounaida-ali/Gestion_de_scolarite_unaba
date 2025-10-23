import { Component, OnInit } from '@angular/core';
import { ServiceFormation } from '../../services/service-formation';
import { CommonModule } from '@angular/common';
import { Formation } from '../../interfaces/formationInterface';
import { Programme } from '../../interfaces/ProgramInterface';
import { Program } from '../program/program';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, Program],
  templateUrl: './formation.html',
  styleUrl: './formation.css',
})
export class formation implements OnInit {
  departements: DepartementAvecFormations[] = [];
  selectedProgramme: Programme | null = null;
  modalOpen = false;
  isLoading = false;
  error: string | null = null;

  constructor(private formationService: ServiceFormation) {}

  ngOnInit(): void {
    this.loadData();
    // Test simple pour vérifier que la route fonctionne
  this.formationService.getFormationsByDepartement('68e0f02daf2f0da2695fdf1d').subscribe({
    next: (formations) => console.log('Formations reçues :', formations),
    error: (err) => console.error('Erreur API formations :', err)
  });
  }

  loadData(): void {
    this.isLoading = true;

    this.formationService.getDepartementsAvecFormations().subscribe({
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

  getDepartmentClass(code: string): string {
    const classes: any = {
      economie: 'eco-header',
      gestion: 'gestion-header',
      droit: 'droit-header',
    };
    return classes[code] || 'eco-header';
  }

  openProgrammeModal(departement: string, code: string): void {
    this.formationService.getProgramme(departement, code).subscribe({
      next: (programme) => {
        this.selectedProgramme = programme;
        this.modalOpen = true;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du programme';
      },
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedProgramme = null;
  }
}
