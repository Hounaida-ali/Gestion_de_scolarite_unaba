import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Niveau } from '../../interfaces/niveauInterface';
import { CommonModule } from '@angular/common';
import { Semestre } from '../../interfaces/semestreInterface';
import { Cours } from '../../interfaces/CourseInterface';
import { UE } from '../../interfaces/ueInterface';
import { Module } from '../../interfaces/moduleInterface';
import { Programme } from '../../interfaces/ProgramInterface';

@Component({
  selector: 'app-program',
  imports: [CommonModule],
  templateUrl: './program.html',
  styleUrl: './program.css'
})
export class Program {
@Input() programme: Programme | null = null;
  @Output() close = new EventEmitter<void>();
  
  currentView: 'overview' | 'level' = 'overview';
  selectedLevel: Niveau | null = null;
  selectedSemester: Semestre | null = null;

  constructor() { }

  closeModal(): void {
    this.close.emit();
  }

  viewLevelDetails(level: Niveau): void {
    this.selectedLevel = level;
    this.currentView = 'level';
    if (level.semestres && level.semestres.length > 0) {
      this.selectedSemester = level.semestres[0];
    }
  }

  backToOverview(): void {
    this.currentView = 'overview';
    this.selectedLevel = null;
    this.selectedSemester = null;
  }

  selectSemester(semestre: Semestre): void {
    this.selectedSemester = semestre;
  }

  calculateUETotal(ue: UE): number {
    return ue.modules.reduce((total: number, module: Module) => {
      return total + module.cours.reduce((modTotal: number, cours: Cours) => {
        return modTotal + cours.totalHeures;
      }, 0);
    }, 0);
  }

  calculateSemesterTotal(semestre: Semestre): number {
    return semestre.ues.reduce((total: number, ue: UE) => {
      return total + this.calculateUETotal(ue);
    }, 0);
  }

  calculateSemesterCredits(semestre: Semestre): number {
    return semestre.ues.reduce((total: number, ue: UE) => {
      return total + ue.totalCredits;
    }, 0);
  }

  // Helper pour vérifier si un semestre est actif
  isSemesterActive(semestre: Semestre): boolean {
    return this.selectedSemester?.numero === semestre.numero;
  }
}

