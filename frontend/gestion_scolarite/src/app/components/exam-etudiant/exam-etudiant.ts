import { ChangeDetectorRef, Component } from '@angular/core';
import { ExamEtudiantService } from '../../services/exam-etudiant-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppNotification, NotificationService } from '../../services/notification-service';
import { Subscription } from 'rxjs'; // ✅ <-- Importer Subscription

export interface ExamSlot {
  _id?: string;
  title: string;
  description?: string;
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
  selector: 'app-exam-etudiant',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exam-etudiant.html',
  styleUrl: './exam-etudiant.css',
})
export class ExamEtudiant {
  exams: ExamSlot[] = [];
  filteredExams: ExamSlot[] = [];

  private notifSub!: Subscription;
  // ✅ Ajouter ces propriétés
  notifications: AppNotification[] = [];

  showNotifications = false;

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
      filieres: [
        { nom: 'gestion', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'finance', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'marketing', niveaux: ['licence1', 'licence2', 'licence3'] },
      ],
    },
  ];

  filteredFilieres: { nom: string; niveaux: string[] }[] = [];
  filteredNiveaux: string[] = [];

  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = [];

  constructor(
    private examEtudiantService: ExamEtudiantService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    // Charger les examens
    this.loadExams();

    // 🔹 S'abonner aux notifications en temps réel
    this.notifSub = this.notificationService.notifications$.subscribe((list) => {
      console.log('Notifications reçues :', list);
      this.notifications = [...list]; // 🔹 Important : copie du tableau
    });

    // Test de notification 

    setTimeout(() => {
      this.notificationService.add({ type: 'success', text: '✅ Notification test' });
      this.showNotifications = true;
    }, 1000);
  }

  ngOnDestroy() {
    this.notifSub?.unsubscribe();
  }

  loadExams() {
    this.examEtudiantService.getExams().subscribe((data) => {
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
        `Filière: ${exam.departement}/${exam.filiere}/${exam.niveau}\n` +
        `Type: ${exam.type}\nDate: ${exam.start.toLocaleDateString()}\n` +
        `Horaire: ${exam.start.toLocaleTimeString()} - ${exam.end.toLocaleTimeString()}`
    );
  }

  refreshPage() {
    this.loadExams();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  removeNotification(index: number) {
  this.notificationService.remove(index);
}


  addExam(exam: ExamSlot) {
    this.examEtudiantService.addExam(exam).subscribe(() => {
      this.loadExams();
      this.notificationService.add({ type: 'success', text: `Examen "${exam.title}" ajouté` });
      this.showNotifications = true;
    });
  }

  updateExam(exam: ExamSlot) {
    this.examEtudiantService.updateExam(exam).subscribe(() => {
      this.loadExams();
      this.notificationService.add({ type: 'info', text: `Examen "${exam.title}" mis à jour` });
      this.showNotifications = true;
    });
  }

  deleteExam(exam: ExamSlot) {
    if (!confirm('Voulez-vous vraiment supprimer cet examen ?')) return;
    this.examEtudiantService.deleteExam(exam._id!).subscribe(() => {
      this.loadExams();
      this.notificationService.add({ type: 'warning', text: `Examen "${exam.title}" supprimé` });
      this.showNotifications = true;
    });
  }
}
