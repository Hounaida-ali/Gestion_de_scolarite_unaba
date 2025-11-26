import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScheduleEtudiantService } from '../../services/schedule-etudiant-service';
import { ScheduleService } from '../../services/schedule-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification-service';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';
import { Formation } from '../../interfaces/formationInterface';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';

export interface Teacher {
  nom: string;
  prenom: string;
}

export interface CourseSlot {
  _id?: string;
  title: string;
  teacher: Teacher;
  departement: string;
  filiere: string;
  niveau: string;
  group: 'TD' | 'TP' | 'CM';
  room: string;
  start: Date;
  end: Date;
  notified: boolean;
  canceled: boolean;
}
interface FiliereOption {
  _id: string;
  nom: string;
  niveaux: string[];
}
@Component({
  selector: 'app-schedule-etudiant',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedule-etudiant.html',
  styleUrl: './schedule-etudiant.css',
})
export class ScheduleEtudiant {
   slots: CourseSlot[] = [];
  filteredSlots: CourseSlot[] = [];

  selectedCourse: CourseSlot | null = null;
  showForm = false;

  errorMessage = '';
  successMessage = '';

  departements: DepartementAvecFormations[] = [];
  formations: Formation[] = [];

  // Pour les FILTRES de recherche
  filteredFilieres: FiliereOption[] = [];
  filteredNiveaux: string[] = [];

  // Pour le FORMULAIRE d'ajout/modification
  formFilieres: FiliereOption[] = [];
  formNiveaux: string[] = [];

  departementFilter = '';
  filiereFilter = '';
  niveauFilter = '';

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = [];

  salles: string[] = [
    'salle1',
    'salle2',
    'salle3',
    'salle4',
    'salle5',
    'salle6',
    'salle7',
    'salle8',
    'salle9',
    'salle10',
    'salle11',
    'salle12',
  ];

  constructor(
    private slotService: ScheduleService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private formationEtudiantService: FormationEtudiantService
  ) {}

  ngOnInit() {
    this.loadSlots();
    this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
      next: (deps) => (this.departements = deps),
      error: () => console.error('Erreur de chargement des départements'),
    });
  }

  loadSlots() {
    this.slotService.getSlots().subscribe({
      next: (data: any[]) => {
        this.slots = data.map((slot) => ({
          ...slot,
          start: new Date(slot.start),
          end: new Date(slot.end),
        }));
        this.filteredSlots = [...this.slots];
        this.generateTimeSlots();
      },
      error: () => (this.errorMessage = 'Erreur lors du chargement des cours'),
    });
  }

  generateTimeSlots() {
    const horaires = new Set<string>();
    this.slots.forEach((slot) => {
      const s = slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const e = slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      horaires.add(`${s}-${e}`);
    });
    this.timeSlots = Array.from(horaires).sort();
  }

  /* ---------------- FILTRES DE RECHERCHE ---------------- */
  onDepartementChange() {
    const dep = this.departements.find((d) => d._id === this.departementFilter);
    this.formations = dep ? dep.formations : [];

    this.filteredFilieres = dep
      ? dep.formations.map((f) => ({
          _id: f._id,
          nom: f.nom,
          niveaux: f.programmes.flatMap((p) => p.niveaux.map((n) => n.nom)),
        }))
      : [];

    this.filiereFilter = '';
    this.niveauFilter = '';
    this.filteredNiveaux = [];
    this.filteredSlots = [];
  }

  onFiliereChange() {
    const f = this.filteredFilieres.find((fl) => fl._id === this.filiereFilter);
    this.filteredNiveaux = f ? f.niveaux : [];
    this.niveauFilter = '';
    this.filteredSlots = [];
  }

  filterSlots() {
    if (!this.departementFilter || !this.filiereFilter || !this.niveauFilter) {
      this.filteredSlots = [];
      return;
    }
    this.filteredSlots = this.slots.filter(
      (s) =>
        s.departement === this.departementFilter &&
        s.filiere === this.filiereFilter &&
        s.niveau === this.niveauFilter
    );
  }

  // /* ---------------- FORMULAIRE ---------------- */
  // newCourse() {
  //   this.selectedCourse = {
  //     title: '',
  //     teacher: { nom: '', prenom: '' },
  //     departement: '',
  //     filiere: '',
  //     niveau: '',
  //     group: 'CM',
  //     room: '',
  //     start: new Date(),
  //     end: new Date(),
  //     notified: false,
  //     canceled: false,
  //   };
  //   this.formFilieres = [];
  //   this.formNiveaux = [];
  //   this.showForm = true;
  // }

  // editCourse(course: CourseSlot) {
  //   this.selectedCourse = { ...course };
    
  //   // ✅ Pré-charger les filières et niveaux si un département est déjà sélectionné
  //   if (this.selectedCourse.departement) {
  //     this.onFormDepartementChange();
      
  //     // Si une filière est déjà sélectionnée, charger les niveaux
  //     if (this.selectedCourse.filiere) {
  //       setTimeout(() => this.onFormFiliereChange(), 100);
  //     }
  //   }
    
  //   this.showForm = true;
  // }

  // // ✅ CORRECTION : Mise à jour du département dans le FORMULAIRE
  // onFormDepartementChange() {
  //   if (!this.selectedCourse) return;
    
  //   const dep = this.departements.find((d) => d._id === this.selectedCourse!.departement);
    
  //   // ✅ Utiliser formFilieres au lieu de filteredFilieres
  //   this.formFilieres = dep
  //     ? dep.formations.map((f) => ({
  //         _id: f._id,
  //         nom: f.nom,
  //         niveaux: f.programmes.flatMap((p) => p.niveaux.map((n) => n.nom)),
  //       }))
  //     : [];
    
  //   // Réinitialiser filière et niveau
  //   this.formNiveaux = [];
  //   this.selectedCourse.filiere = '';
  //   this.selectedCourse.niveau = '';
  // }

  // // ✅ CORRECTION : Mise à jour de la filière dans le FORMULAIRE
  // onFormFiliereChange() {
  //   if (!this.selectedCourse) return;

  //   // ✅ Utiliser formFilieres au lieu de filteredFilieres
  //   const f = this.formFilieres.find((fil) => fil._id === this.selectedCourse!.filiere);

  //   // ✅ Utiliser formNiveaux au lieu de filteredNiveaux
  //   this.formNiveaux = f ? f.niveaux : [];
  //   this.selectedCourse.niveau = '';
  // }

  // /* ---------------- CRUD ---------------- */
  // addCourse() {
  //   if (!this.selectedCourse) return;

  //   // ✅ Validation avant envoi
  //   if (
  //     !this.selectedCourse.departement ||
  //     !this.selectedCourse.filiere ||
  //     !this.selectedCourse.niveau ||
  //     !this.selectedCourse.room ||
  //     !this.selectedCourse.teacher
  //   ) {
  //     this.showMessage(
  //       'Veuillez remplir tous les champs obligatoires (département, filière, niveau, enseignant, salle)',
  //       'error'
  //     );
  //     return;
  //   }

  //   // Préparer le payload avec conversion de dates
  //   const payload: CourseSlot = {
  //     ...this.selectedCourse,
  //     start: new Date(this.selectedCourse.start),
  //     end: new Date(this.selectedCourse.end),
  //     departement: this.selectedCourse.departement,
  //     filiere: this.selectedCourse.filiere,
  //     teacher: this.selectedCourse.teacher,
  //   };

  //   console.log('Payload envoyé au backend:', payload);

  //   // Appel du service
  //   this.slotService.addSlot(payload).subscribe({
  //     next: (res: any) => {
  //       const saved: CourseSlot = res.course || res;
  //       this.slots.push(saved);
  //       this.filteredSlots.push(saved);
  //       this.resetForm();
  //       this.showMessage(`Cours "${saved.title}" ajouté avec succès !`, 'success');
  //     },
  //     error: (err) => {
  //       const backendMsg = err.error?.message || "Erreur lors de l'ajout du cours";
  //       this.showMessage(backendMsg, 'error');
  //     },
  //   });
  // }

  // updateCourse() {
  //   if (!this.selectedCourse || !this.selectedCourse._id) return;
  //   const payload: CourseSlot = {
  //     ...this.selectedCourse,
  //     start: new Date(this.selectedCourse.start),
  //     end: new Date(this.selectedCourse.end),
  //   };
  //   this.slotService.updateSlot(payload).subscribe({
  //     next: (res: any) => {
  //       const updated: CourseSlot = res.course || res;
  //       const index = this.slots.findIndex((s) => s._id === updated._id);
  //       if (index !== -1) this.slots[index] = updated;

  //       const filteredIndex = this.filteredSlots.findIndex((s) => s._id === updated._id);
  //       if (filteredIndex !== -1) this.filteredSlots[filteredIndex] = updated;

  //       this.resetForm();
  //       this.showMessage(`Cours "${updated.title}" mis à jour avec succès !`, 'success');
  //     },
  //     error: (err) => this.showMessage(err.error?.message || 'Erreur update', 'error'),
  //   });
  // }

  // submitCourse() {
  //   if (!this.selectedCourse) return;
  //   if (this.selectedCourse._id) this.updateCourse();
  //   else this.addCourse();
  // }

  // deleteCourse(course: CourseSlot) {
  //   if (!confirm('Voulez-vous supprimer ce cours ?')) return;
  //   this.slotService.deleteSlot(course._id!).subscribe({
  //     next: () => {
  //       this.slots = this.slots.filter((s) => s._id !== course._id);
  //       this.filteredSlots = this.filteredSlots.filter((s) => s._id !== course._id);
  //       this.showMessage(`Cours "${course.title}" supprimé avec succès !`, 'success');
  //     },
  //     error: (err) => this.showMessage(err.error?.message || 'Erreur suppression', 'error'),
  //   });
  // }

  // resetForm() {
  //   this.selectedCourse = null;
  //   this.showForm = false;
  //   this.formFilieres = [];
  //   this.formNiveaux = [];
  // }

  /* ---------------- UTILITAIRES ---------------- */
  showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), duration);
    } else {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), duration);
    }
  }

  getDayName(date: Date): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date(date).getDay()];
  }

  formatTime(start: Date, end: Date): string {
    const s = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const e = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${s}-${e}`;
  }

  showDetails(slot: CourseSlot) {
    const status = slot.canceled ? '❌ Annulé' : '✅ Actif';
    const teacherName =
      slot.teacher && typeof slot.teacher === 'object'
        ? `${slot.teacher.nom || 'Inconnu'} ${slot.teacher.prenom || ''}`
        : 'Inconnu';
    alert(
      `Cours: ${slot.title}\nEnseignant: ${teacherName}\nSalle: ${slot.room}\n` +
        `Groupe: ${slot.group}\n` +
        `Date: ${slot.start.toLocaleDateString()}\n` +
        `Horaire: ${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}\n` +
        `Statut: ${status}`
    );
  }
  refreshPage() {
    window.location.reload();
  }
}
