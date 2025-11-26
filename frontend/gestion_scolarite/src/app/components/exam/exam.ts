import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification-service';
import { Departement } from '../../interfaces/departementInterface';
import { Formation } from '../../interfaces/formationInterface';
import { EtudiantService } from '../../services/etudiant-service';
import { DepartementAvecFormations } from '../../interfaces/DepartementAvecFormations';
import { FormationEtudiantService } from '../../services/formation-etudiant-service';

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
interface FiliereOption {
  _id: string;
  nom: string;
  niveaux: string[];
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

  departements: DepartementAvecFormations[] = [];
  formations: Formation[] = [];

  // 🔹 Filtres
  departementFilter = '';
  filiereFilter = '';
  niveauFilter = '';

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

  // 🔹 Types corrigés pour inclure _id
  filteredFilieres: FiliereOption[] = [];
  filteredNiveaux: string[] = [];

  formFilieres: FiliereOption[] = [];
  formNiveaux: string[] = [];

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = [];

  constructor(
    private examService: ExamService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private formationEtudiantService: FormationEtudiantService
  ) {}

  ngOnInit() {
    this.loadExams();

    this.formationEtudiantService.getDepartementsAvecFormations().subscribe({
      next: (departements) => (this.departements = departements),
      error: () => console.error('Erreur lors du chargement des départements'),
    });
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

  // 🔹 Filtrage département
  onDepartementChange() {
    const dep = this.departements.find((d) => d._id === this.departementFilter);
    if (dep) this.formations = dep.formations;

    // 🔹 Correction : ajouter _id pour les options
    this.filteredFilieres = dep
      ? this.formations
          .filter((f) =>
            typeof f.departement === 'string'
              ? f.departement === dep._id
              : f.departement?._id === dep._id
          )
          .map((f) => ({
            _id: f._id,
            nom: f.nom,
            niveaux: f.programmes.flatMap((p) => p.niveaux.map((n) => n.nom)),
          }))
      : [];

    this.filiereFilter = '';
    this.filteredNiveaux = [];
    this.niveauFilter = '';
    this.filteredExams = [];
  }
 onFormFiliereChange() {
  if (!this.selectedExam) return;

  const f = this.filteredFilieres.find((fil) => fil._id === this.selectedExam!.filiere);

  this.filteredNiveaux = f ? f.niveaux : [];
  this.selectedExam.niveau = '';
}

  onFiliereChange() {
    const f = this.filteredFilieres.find((f) => f._id === this.filiereFilter);
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

  // ✅ Validation avant envoi
  if (!this.selectedExam.filiere || !this.selectedExam.niveau || !this.selectedExam.room) {
    this.showMessage('Veuillez sélectionner une filière, un niveau et une salle', 'error');
    return;
  }

  const payload: ExamSlot = {
    ...this.selectedExam,
    departement: this.departementFilter,
    filiere: this.selectedExam.filiere,
    start: new Date(this.selectedExam.start),
    end: new Date(this.selectedExam.end),
  };

  console.log('Payload envoyé au backend:', payload);

  this.examService.addExam(payload).subscribe({
    next: (res: any) => {
      const saved: ExamSlot = res.exam || res;
      this.exams.push(saved);
      this.filteredExams.push(saved);
      this.resetForm();
      this.showMessage(`Examen "${saved.title}" ajouté avec succès !`, 'success');
    },
    error: (err) => {
      const backendMsg = err.error?.message || "Erreur lors de l'ajout de l'examen";
      this.showMessage(backendMsg, 'error');
    },
  });
}


  editExam(exam: ExamSlot) {
    this.selectedExam = { ...exam };
    this.showForm = true;
  }

  updateExam() {
    if (!this.selectedExam || !this.selectedExam._id) return;

    const payload: ExamSlot = {
      ...this.selectedExam,
      departement: this.departementFilter || this.selectedExam.departement,
      filiere: this.filiereFilter || this.selectedExam.filiere,
      niveau: this.niveauFilter || this.selectedExam.niveau,
      start: new Date(this.selectedExam.start),
      end: new Date(this.selectedExam.end),
    };

    this.examService.updateExam(payload).subscribe({
      next: (res: any) => {
        const updated: ExamSlot = res.exam || res;
        const index = this.exams.findIndex((e) => e._id === updated._id);
        if (index !== -1) this.exams[index] = updated;

        const filteredIndex = this.filteredExams.findIndex((e) => e._id === updated._id);
        if (filteredIndex !== -1) this.filteredExams[filteredIndex] = updated;

        this.resetForm();
        this.showMessage(`Examen "${updated.title}" mis à jour avec succès !`, 'success');
      },
      error: (err) => {
        const backendMsg = err.error?.message || 'Erreur lors de la mise à jour';
        this.showMessage(backendMsg, 'error');
      },
    });
  }

  deleteExam(exam: ExamSlot) {
    if (!confirm('Voulez-vous vraiment supprimer cet examen ?')) return;

    this.examService.deleteExam(exam._id!).subscribe({
      next: (res: any) => {
        this.filteredExams = this.filteredExams.filter((e) => e._id !== exam._id);
        this.exams = this.exams.filter((e) => e._id !== exam._id);
        this.showMessage(`Examen "${exam.title}" supprimé avec succès !`, 'success');
      },
      error: (err) => {
        const backendMsg = err.error?.message || 'Erreur lors de la suppression';
        this.showMessage(backendMsg, 'error');
      },
    });
  }

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
        `Type: ${exam.type}\nDate: ${exam.start.toLocaleDateString()}\n` +
        `Horaire: ${exam.start.toLocaleTimeString()} - ${exam.end.toLocaleTimeString()}`
    );
  }

  refreshPage() {
    window.location.reload();
  }
}
