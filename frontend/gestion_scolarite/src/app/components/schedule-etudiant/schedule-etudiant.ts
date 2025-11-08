import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleEtudiantService } from '../../services/schedule-etudiant-service';


export interface CourseSlot {
 _id?: string
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

@Component({
  selector: 'app-schedule-etudiant',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedule-etudiant.html',
  styleUrl: './schedule-etudiant.css'
})
export class ScheduleEtudiant {
slots: CourseSlot[] = [];
  filteredSlots: CourseSlot[] = [];
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = [];
  loading = true;
  showModal = false;
  courseForm: FormGroup;

  // Filtres
  departementFilter = 'tous';
  filiereFilter = 'tous';
  niveauFilter = 'tous';
  teacherFilter = 'tous';

  // Données pour filtrage dynamique
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
      filieres: [
        { nom: 'gestion', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'finance', niveaux: ['licence1', 'licence2', 'licence3'] },
        { nom: 'marketing', niveaux: ['licence1', 'licence2', 'licence3'] },
      ],
    },
  ];

  filteredFilieres: { nom: string; niveaux: string[] }[] = [];
  filteredNiveaux: string[] = [];

  constructor(private scheduleEtudiantService: ScheduleEtudiantService, private fb: FormBuilder) {
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

  /** 🔹 Mise à jour des filières selon le département choisi */
onDepartementChange() {
  const dep = this.departements.find(d => d.nom === this.departementFilter);
  this.filteredFilieres = dep ? dep.filieres : [];
  this.filiereFilter = '';
  this.filteredNiveaux = [];
  this.niveauFilter = '';
  this.filteredSlots = []; // rien à afficher tant que filière et niveau pas choisis
}

/** 🔹 Mise à jour des niveaux selon la filière choisie */
onFiliereChange() {
  const f = this.filteredFilieres.find(f => f.nom === this.filiereFilter);
  this.filteredNiveaux = f ? f.niveaux : [];
  this.niveauFilter = '';
  this.filteredSlots = []; // rien à afficher tant que niveau pas choisi
}

/** 🔹 Filtrage des cours seulement si tous les filtres sont choisis */
filterSlots() {
  if (!this.departementFilter || !this.filiereFilter || !this.niveauFilter) {
    this.filteredSlots = []; // aucun affichage si un filtre est manquant
    return;
  }

  this.filteredSlots = this.slots.filter(
    s =>
      s.departement === this.departementFilter &&
      s.filiere === this.filiereFilter &&
      s.niveau === this.niveauFilter
  );
}


  /** 🔹 Charger les cours et générer les horaires automatiquement */
  loadSlots() {
    this.loading = true;
    this.scheduleEtudiantService.getSlots().subscribe({
      next: (data) => {
        console.log('✅ Données reçues du backend :', data);
        this.slots = data.map((slot) => ({
          ...slot,
          start: new Date(slot.start),
          end: new Date(slot.end),
        }));

        const horaires = new Set<string>();
        this.slots.forEach((slot) => {
          const start = slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const end = slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          horaires.add(`${start}-${end}`);
        });

        this.timeSlots = Array.from(horaires).sort();
        this.filteredSlots = [...this.slots];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur de chargement des cours :', err);
        this.loading = false;
      },
    });
  }

  // /** 🔹 Filtrage global */
  // filterSlots() {
  //   console.log(
  //     '🔍 Filtrage appliqué avec :',
  //     this.departementFilter,
  //     this.filiereFilter,
  //     this.niveauFilter
  //   );
  //   this.filteredSlots = this.slots.filter(
  //     (s) =>
  //       (this.departementFilter === 'tous' || s.departement === this.departementFilter) &&
  //       (this.filiereFilter === 'tous' || s.filiere === this.filiereFilter) &&
  //       (this.niveauFilter === 'tous' || s.niveau === this.niveauFilter) &&
  //       (this.teacherFilter === 'tous' || s.teacher === this.teacherFilter)
  //   );
  // }

  /** 🔹 Met à jour la liste des filières selon le département choisi */
  updateFilieres() {
    const dep = this.departements.find((d) => d.nom === this.courseForm.get('departement')?.value);
    this.filteredFilieres = dep ? dep.filieres : [];
    this.filteredNiveaux = [];
    this.courseForm.patchValue({ filiere: '', niveau: '' });
  }

  /** 🔹 Met à jour la liste des niveaux selon la filière choisie */
  updateNiveaux() {
    const f = this.filteredFilieres.find((f) => f.nom === this.courseForm.get('filiere')?.value);
    this.filteredNiveaux = f ? f.niveaux : [];
    this.courseForm.patchValue({ niveau: '' });
  }

  /** 🔹 Ouvre et ferme la modale */
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.courseForm.reset({ group: 'CM' });
  }

  /** 🔹 Envoie un nouveau cours */
  submitCourse() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      const newSlot: CourseSlot = {
        _id: '',
        title: formValue.title,
        teacher: formValue.teacher,
        departement: formValue.departement,
        filiere: formValue.filiere,
        niveau: formValue.niveau,
        group: formValue.group,
        room: formValue.room,
        start: new Date(formValue.start),
        end: new Date(formValue.end),
        notified: false,
        canceled: false,
      };

      this.scheduleEtudiantService.addSlot(newSlot).subscribe((saved) => {
        this.slots.push({ ...saved, start: new Date(saved.start), end: new Date(saved.end) });
        this.filterSlots();
        this.scheduleEtudiantService.addNotification(`Nouveau cours ajouté: ${saved.title}`);
        this.closeModal();
      });
    }
  }

  /** 🔹 Bascule l’état du cours (annulé/actif) */
  toggleStatus(slot: CourseSlot) {
    slot.canceled = !slot.canceled;
    this.scheduleEtudiantService.updateSlot(slot).subscribe(() => {
      this.scheduleEtudiantService.addNotification(
        `Cours ${slot.canceled ? 'annulé' : 'activé'}: ${slot.title}`
      );
    });
  }

  /** 🔹 Supprime un cours */
deleteCourse(slot: CourseSlot) {
  if (!slot._id) {
    console.error('Impossible de supprimer un cours sans _id');
    return;
  }

  if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
    this.scheduleEtudiantService.deleteSlot(slot._id).subscribe(() => {
      this.slots = this.slots.filter((s) => s._id !== slot._id);
      this.filterSlots();
      this.scheduleEtudiantService.addNotification(`Cours "${slot.title}" supprimé`);
    });
  }
}


  /** 🔹 Affiche les détails du cours */
  showDetails(slot: CourseSlot) {
    const status = slot.canceled ? 'Annulé' : 'Actif';
    alert(
      `Cours: ${slot.title}\nEnseignant: ${slot.teacher}\nSalle: ${slot.room}\n` +
        `Departement: ${slot.departement}/${slot.filiere}/${slot.niveau}\nGroupe: ${slot.group}\n` +
        `Date: ${slot.start.toLocaleDateString()}\n` +
        `Horaire: ${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}\n` +
        `Statut: ${status}`
    );
  }

  /** 🔹 Retourne le nom du jour en français */
  getDayName(date: Date): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date(date).getDay()];
  }

  /** 🔹 Retourne un créneau horaire formaté */
  formatTime(start: Date, end: Date): string {
    const startStr = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${startStr}-${endStr}`;
  }
  refreshPage() {
    window.location.reload();
  }
  
}


