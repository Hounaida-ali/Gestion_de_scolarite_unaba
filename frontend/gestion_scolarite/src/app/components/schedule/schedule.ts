import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScheduleService } from '../../services/schedule-service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification-service';

// =============================================
// 🔹 Interface des cours
// =============================================
export interface CourseSlot {
  _id?: string;
  title: string;
  teacher: string;
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

// =============================================
// 🔹 Composant principal
// =============================================
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
})
export class Schedule {
  // ------------------------------
  // 🔸 Messages & états
  // ------------------------------
  errorMessage = '';
  successMessage = '';
  loading = true;

  formFilieres: { nom: string; niveaux: string[] }[] = [];
  formNiveaux: string[] = [];

  // ------------------------------
  // 🔸 Données principales
  // ------------------------------
  slots: CourseSlot[] = [];
  filteredSlots: CourseSlot[] = [];

  // ------------------------------
  // 🔸 Données pour affichage du tableau
  // ------------------------------
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = [];

  // ------------------------------
  // 🔸 États d’interface
  // ------------------------------
  showModal = false;
  showForm = false; // ✅ ajouté
  selectedCourse: CourseSlot | null = null; // ✅ ajouté

  // ------------------------------
  // 🔸 Formulaire
  // ------------------------------
  courseForm: FormGroup;

  // ------------------------------
  // 🔸 Filtres
  // ------------------------------
  departementFilter = '';
  filiereFilter = '';
  niveauFilter = '';
  teacherFilter = '';

  // ------------------------------
  // 🔸 Hiérarchie des départements
  // ------------------------------
  departements = [
    {
      nom: 'économie',
      filieres: [
        { nom: 'science-économie', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'économie-monaiteur', niveaux: ['licence1', 'licence2', 'licence3'] },
      ],
    },
    {
      nom: 'droit',
      filieres: [{ nom: 'droit', niveaux: ['licence1', 'licence2', 'licence3'] }],
    },
    {
      nom: 'gestion',
      filieres: [{ nom: 'gestion', niveaux: ['licence1', 'licence2', 'licence3'] }],
    },
  ];

  filteredFilieres: { nom: string; niveaux: string[] }[] = [];
  filteredNiveaux: string[] = [];

  // =============================================
  // 🔹 Constructeur
  // =============================================
  constructor(
    private slotService: ScheduleService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      teacher: ['', Validators.required],
      departement: ['', Validators.required],
      filiere: ['', Validators.required],
      niveau: ['', Validators.required],
      group: ['CM', Validators.required],
      room: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSlots();
  }

  // ======================================================
  // 🔹 GESTION DES FILTRES ET FORMULAIRES
  // ======================================================

  // 🔹 Quand on change le département dans la zone de filtrage principale
  onDepartementChange() {
    const dep = this.departements.find((d) => d.nom === this.departementFilter);
    this.filteredFilieres = dep ? dep.filieres : [];
    this.filiereFilter = '';
    this.filteredNiveaux = [];
    this.niveauFilter = '';
    this.filteredSlots = [];
  }

  // 🔹 Quand on change la filière dans la zone de filtrage principale
  onFiliereChange() {
    const f = this.filteredFilieres.find((f) => f.nom === this.filiereFilter);
    this.filteredNiveaux = f ? f.niveaux : [];
    this.niveauFilter = '';
    this.filteredSlots = [];
  }

  // 🔹 Appliquer les filtres au tableau
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

  // 🔹 Quand on change le département dans le formulaire d’ajout / modification
  // 🔹 Quand on change le département dans le formulaire
  onFormDepartementChange() {
    if (!this.selectedCourse) return;

    const dep = this.departements.find((d) => d.nom === this.selectedCourse!.departement);
    this.filteredFilieres = dep ? dep.filieres : [];
    this.filteredNiveaux = [];

    // Reset filiere et niveau
    this.selectedCourse.filiere = '';
    this.selectedCourse.niveau = '';
  }

  // 🔹 Quand on change la filière dans le formulaire
  onFormFiliereChange() {
    if (!this.selectedCourse) return;

    const f = this.filteredFilieres.find((f) => f.nom === this.selectedCourse!.filiere);
    this.filteredNiveaux = f ? f.niveaux : [];

    // Reset niveau
    this.selectedCourse.niveau = '';
  }

  // =============================================
  // 🔹 Chargement des données
  // =============================================
  loadSlots() {
    this.loading = true;
    this.slotService.getSlots().subscribe({
      next: (data) => {
        this.slots = data.map((slot) => ({
          ...slot,
          start: new Date(slot.start),
          end: new Date(slot.end),
        }));
        this.filteredSlots = [...this.slots];
        // Génération automatique des créneaux horaires via la méthode dédiée
        this.generateTimeSlots();

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur de chargement des cours';
        this.loading = false;
      },
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

  // =============================================
  // 🔹 Gestion du formulaire
  // =============================================
  updateFilieres() {
    const dep = this.departements.find((d) => d.nom === this.courseForm.get('departement')?.value);
    this.filteredFilieres = dep ? dep.filieres : [];
    this.filteredNiveaux = [];
    this.courseForm.patchValue({ filiere: '', niveau: '' });
  }

  updateNiveaux() {
    const f = this.filteredFilieres.find((f) => f.nom === this.courseForm.get('filiere')?.value);
    this.filteredNiveaux = f ? f.niveaux : [];
    this.courseForm.patchValue({ niveau: '' });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.courseForm.reset({ group: 'CM' });
  }

  // =============================================
  // 🔹 Ajout / Modification
  // =============================================
  newCourse() {
    this.selectedCourse = {
      title: '',
      teacher: '',
      departement: '',
      filiere: '',
      niveau: '',
      group: 'CM',
      room: '',
      start: new Date(),
      end: new Date(),
      notified: false,
      canceled: false,
    };
    this.formFilieres = [];
    this.formNiveaux = [];
    this.showForm = true;
  }

  loadCourses() {
    this.slotService.getSlots().subscribe((data) => {
      this.slots = data.map((s: any) => ({
        ...s,
        start: new Date(s.start),
        end: new Date(s.end),
      }));

      // On met aussi à jour la liste filtrée
      this.filteredSlots = this.slots.filter(
        (s) =>
          (!this.departementFilter || s.departement === this.departementFilter) &&
          (!this.filiereFilter || s.filiere === this.filiereFilter) &&
          (!this.niveauFilter || s.niveau === this.niveauFilter)
      );

      // Si tu as une méthode pour générer les horaires (comme pour exam)
      if (this.generateTimeSlots) {
        this.generateTimeSlots();
      }
    });
  }

  /// 🔹 Ajout d’un cours
  // 🔹 Ajout d’un cours
  // Méthode utilitaire pour afficher des messages temporaires
showMessage(msg: string, type: 'success' | 'error', duration = 3000) {
  if (type === 'success') {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), duration);
  } else {
    this.errorMessage = msg;
    setTimeout(() => (this.errorMessage = ''), duration);
  }
}


// Ajouter un cours
addCourse() {
  if (!this.selectedCourse) return;

  const payload: CourseSlot = {
    ...this.selectedCourse,
    start: new Date(this.selectedCourse.start),
    end: new Date(this.selectedCourse.end),
  };

  this.slotService.addSlot(payload).subscribe({
    next: (res: any) => {
      const saved: CourseSlot = res.course || res;
      const message = res.message || `Cours "${saved.title}" ajouté avec succès !`;

      // ❌ Ne pas ajouter localement (évite "Invalid Date - Invalid Date")
      // this.slots.push(saved);
      // this.filteredSlots.push(saved);

      // ✅ Réinitialiser le formulaire
      this.resetForm();

      // ✅ Notification interne
      this.notificationService.add({
        type: 'success',
        text: message,
      });

      // ✅ Message du backend (succès)
      this.showMessage(message, 'success', 3000);
    },
    error: (err) => {
      const backendMsg = err.error?.message || "Erreur lors de l'ajout du cours";
      // ✅ Message d’erreur du backend
      this.showMessage(backendMsg, 'error', 5000);
    },
  });
}




  editCourse(course: CourseSlot) {
    this.selectedCourse = {
      ...course,
    };
    this.showForm = true;
  }

  // Mettre à jour un cours
updateCourse() {
  if (!this.selectedCourse || !this.selectedCourse._id) return;

  const payload: CourseSlot = {
    ...this.selectedCourse,
    start: new Date(this.selectedCourse.start),
    end: new Date(this.selectedCourse.end),
  };

  this.slotService.updateSlot(payload).subscribe({
    next: (res: any) => {
      const updated: CourseSlot = res.course || res;
      const message = res.message || `Cours "${updated.title}" mis à jour avec succès !`;

      // Mise à jour locale
      const index = this.slots.findIndex((s) => s._id === updated._id);
      if (index !== -1)
        this.slots[index] = { ...updated, start: new Date(updated.start), end: new Date(updated.end) };

      const filteredIndex = this.filteredSlots.findIndex((s) => s._id === updated._id);
      if (filteredIndex !== -1)
        this.filteredSlots[filteredIndex] = { ...updated, start: new Date(updated.start), end: new Date(updated.end) };

      this.generateTimeSlots();
      this.resetForm();

      this.notificationService.add({
        type: 'info',
        text: message,
      });

      // ✅ Message du backend
      this.showMessage(message, 'success', 3000);
    },
    error: (err) => {
      const backendMsg = err.error?.message || "Erreur lors de la mise à jour du cours";
      this.showMessage(backendMsg, 'error', 5000);
    },
  });
}

  // 🔹 Gestion du formulaire
  submitCourse() {
    if (!this.selectedCourse) return;

    if (this.selectedCourse._id) {
      this.updateCourse();
    } else {
      this.addCourse(); // Ajout immédiat avec mise à jour de filteredSlots
    }
  }

  resetForm() {
    this.selectedCourse = null;
    this.showForm = false;
  }

  // submitCourse() {
  //   if (!this.selectedCourse) return;

  //   if (this.selectedCourse._id) {
  //     this.updateCourse();
  //   } else {
  //     this.addCourse(); // ici, addCourse() doit récupérer les valeurs du formulaire
  //   }
  // }

  // 🔹 Suppression d’un cours
  deleteCourse(course: CourseSlot) {
  if (!confirm('Voulez-vous vraiment supprimer ce cours ?')) return;

  this.errorMessage = '';
  this.successMessage = '';

  this.slotService.deleteSlot(course._id!).subscribe({
    next: (res: any) => {
      const message = res.message || `Cours "${course.title}" supprimé avec succès !`;

      // ✅ Supprimer localement sans recharger
      this.slots = this.slots.filter((s) => s._id !== course._id);
      this.filteredSlots = this.filteredSlots.filter((s) => s._id !== course._id);

      // ✅ Afficher le message de succès
      this.showMessage(message, 'success');

      // ✅ Notification interne
      this.notificationService.add({
        type: 'warning',
        text: message,
      });

      // (Optionnel) Recalcul des créneaux si ton composant les affiche
      if (this.generateTimeSlots) this.generateTimeSlots();
    },
    error: (err) => {
      const backendMsg = err.error?.message || 'Erreur lors de la suppression';
      this.showMessage(backendMsg, 'error');
    },
  });
}

  // =============================================
  // 🔹 Suppression / Statut
  // =============================================
  toggleStatus(slot: CourseSlot) {
    slot.canceled = !slot.canceled;
    this.slotService.updateSlot(slot).subscribe(() => {
      const msg = `Cours ${slot.canceled ? 'annulé' : 'réactivé'} : ${slot.title}`;
      this.notificationService.add({ type: 'warning', text: msg });
      this.snackBar.open(msg, 'Fermer', { duration: 2500 });
    });
  }

  // deleteCourse(slot: CourseSlot) {
  //   if (!confirm('Voulez-vous vraiment supprimer ce cours ?')) return;

  //   this.slotService.deleteSlot(slot._id!).subscribe({
  //     next: () => {
  //       this.slots = this.slots.filter((s) => s._id !== slot._id);
  //       this.filterSlots();
  //       const msg = `Cours "${slot.title}" supprimé`;
  //       this.notificationService.add({ type: 'error', text: msg });
  //       this.snackBar.open(msg, 'Fermer', { duration: 2500 });
  //     },
  //     error: () => {
  //       this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 2500 });
  //     },
  //   });
  // }

  // =============================================
  // 🔹 Utilitaires
  // =============================================
  showDetails(slot: CourseSlot) {
    const status = slot.canceled ? '❌ Annulé' : '✅ Actif';
    alert(
      `Cours: ${slot.title}\nEnseignant: ${slot.teacher}\nSalle: ${slot.room}\n` +
        `Département: ${slot.departement}/${slot.filiere}/${slot.niveau}\n` +
        `Groupe: ${slot.group}\n` +
        `Date: ${slot.start.toLocaleDateString()}\n` +
        `Horaire: ${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}\n` +
        `Statut: ${status}`
    );
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

  refreshPage() {
    window.location.reload();
  }
}
