import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification-service';

export interface ExamSlot {
  _id?: string;
  title: string;
  description?: string;
  date?: string;
  type: 'examen' | 'devoir';
  departement: string;
  filiere: string;
  niveau: string;
  room: string;
  start: Date;
  end: Date;
  notified: boolean;
}

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './exam.html',
  styleUrls: ['./exam.css'],
})
export class Exam {
  exams: ExamSlot[] = [];
  filteredExams: ExamSlot[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  selectedExam: ExamSlot | null = null;
  showForm = false;

  // Filtres
  departementFilter = '';
  filiereFilter = '';
  niveauFilter = '';

  departements = [
    {
      nom: 'économie',
      filieres: [
        { nom: 'science-économie', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'économie-moniteur', niveaux: ['licence1', 'licence2', 'licence3'] },
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
  // Listes spécifiques au formulaire (pour ne pas interférer avec les filtres du tableau)
  formFilieres: { nom: string; niveaux: string[] }[] = [];
  formNiveaux: string[] = [];

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = [];

  constructor(
    private examService: ExamService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadExams();
    console.log(this.notificationService);
  }

  loadExams() {
    this.examService.getExams().subscribe((data) => {
      this.exams = data.map((e) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }));
      this.filteredExams = [...this.exams];
      this.generateTimeSlots();
    });
  }

  generateTimeSlots() {
    const horaires = new Set<string>();
    this.exams.forEach((e) => {
      const start = e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = e.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      horaires.add(`${start}-${end}`);
    });
    this.timeSlots = Array.from(horaires).sort();
  }

  // 🔹 Quand on change le département dans le formulaire
  // 🔹 Fonction utilisée pour le filtrage dans le tableau principal
  onDepartementChange() {
    const dep = this.departements.find((d) => d.nom === this.departementFilter);
    this.filteredFilieres = dep ? dep.filieres : [];
    this.filiereFilter = '';
    this.filteredNiveaux = [];
    this.niveauFilter = '';
    this.filteredExams = [];
  }

  onFiliereChange() {
    const f = this.filteredFilieres.find((f) => f.nom === this.filiereFilter);
    this.filteredNiveaux = f ? f.niveaux : [];
    this.niveauFilter = '';
    this.filteredExams = [];
  }

  filterExams() {
    if (!this.departementFilter || !this.filiereFilter || !this.niveauFilter) {
      this.filteredExams = [];
      return;
    }
    this.filteredExams = this.exams.filter(
      (e) =>
        e.departement === this.departementFilter &&
        e.filiere === this.filiereFilter &&
        e.niveau === this.niveauFilter
    );
  }

  onFormDepartementChange() {
    if (!this.selectedExam) return;

    const dep = this.departements.find((d) => d.nom === this.selectedExam!.departement);
    this.filteredFilieres = dep ? dep.filieres : [];
    this.selectedExam.filiere = '';
    this.filteredNiveaux = [];
    this.selectedExam.niveau = '';
  }

  onFormFiliereChange() {
    const f = this.filteredFilieres.find((f) => f.nom === this.selectedExam?.filiere);
    this.filteredNiveaux = f ? f.niveaux : [];
    if (this.selectedExam) this.selectedExam.niveau = '';
  }

  // 🔹 Ajout d’un examen
  newExam() {
    this.selectedExam = {
      title: '',
      description: '',
      date: '',
      type: 'examen',
      departement: '',
      filiere: '',
      niveau: '',
      room: '',
      start: new Date(),
      end: new Date(),
      notified: false,
    };
    this.formFilieres = [];
    this.formNiveaux = [];
    this.showForm = true;
  }

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

  addExam() {
    if (!this.selectedExam) return;

    const payload: ExamSlot = {
      ...this.selectedExam,
      start: new Date(this.selectedExam.start),
      end: new Date(this.selectedExam.end),
    };

    this.examService.addExam(payload).subscribe({
      next: (res: any) => {
        const saved: ExamSlot = res.exam || res;
        const message = res.message || `Examen "${saved.title}" ajouté avec succès !`;

        // Mise à jour de la liste
        this.exams.push(saved);
        this.filteredExams.push(saved);

        this.resetForm();

        // Notification interne
        this.notificationService.add({
          type: 'success',
          text: message,
        });

        // ✅ Message du backend affiché ici
        this.showMessage(message, 'success');
      },
      error: (err) => {
        const backendMsg = err.error?.message || "Erreur lors de l'ajout de l'examen";
        // ✅ Message d’erreur du backend
        this.showMessage(backendMsg, 'error');
      },
    });
  }

  // 🔹 Edition
  editExam(exam: ExamSlot) {
    this.selectedExam = { ...exam };
    this.showForm = true;
  }

  updateExam() {
    if (!this.selectedExam || !this.selectedExam._id) return;

    const payload: ExamSlot = {
      ...this.selectedExam,
      start: new Date(this.selectedExam.start),
      end: new Date(this.selectedExam.end),
    };

    this.examService.updateExam(payload).subscribe({
      next: (res: any) => {
        const updated: ExamSlot = res.exam || res;
        const message = res.message || `Examen "${updated.title}" mis à jour avec succès !`;

        // Mise à jour dans les listes locales
        const index = this.exams.findIndex((e) => e._id === updated._id);
        if (index !== -1) this.exams[index] = updated;

        const filteredIndex = this.filteredExams.findIndex((e) => e._id === updated._id);
        if (filteredIndex !== -1) this.filteredExams[filteredIndex] = updated;

        this.resetForm();

        this.notificationService.add({
          type: 'info',
          text: message,
        });

        // ✅ Message du backend
        this.showMessage(message, 'success');
      },
      error: (err) => {
        const backendMsg = err.error?.message || "Erreur lors de la mise à jour de l'examen";
        this.showMessage(backendMsg, 'error');
      },
    });
  }

  // 🔹 Suppression
  deleteExam(exam: ExamSlot) {
    if (!confirm('Voulez-vous vraiment supprimer cet examen ?')) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.examService.deleteExam(exam._id!).subscribe({
      next: (res: any) => {
        const message = res.message || `Examen "${exam.title}" supprimé avec succès !`;

        this.successMessage = message;
        this.loadExams();

        this.notificationService.add({
          type: 'warning',
          text: message,
        });

        // ✅ Message du backend
        this.showMessage(message, 'success');
      },
      error: (err) => {
        const backendMsg = err.error?.message || 'Erreur lors de la suppression';
        this.showMessage(backendMsg, 'error');
      },
    });
  }

  // 🔹 Utilitaires
  resetForm() {
    this.selectedExam = null;
    this.showForm = false;
  }

  getDayName(date: Date): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
  }

  formatTime(start: Date, end: Date): string {
    const s = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const e = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${s}-${e}`;
  }

  showDetails(exam: ExamSlot) {
    alert(
      `Examen: ${exam.title}\nDescription: ${exam.description}\nSalle: ${exam.room}\n` +
        `Département: ${exam.departement}/${exam.filiere}/${exam.niveau}\n` +
        `Type: ${exam.type}\nDate: ${exam.start.toLocaleDateString()}\n` +
        `Horaire: ${exam.start.toLocaleTimeString()} - ${exam.end.toLocaleTimeString()}`
    );
  }
  refreshPage() {
    window.location.reload();
  }
}
