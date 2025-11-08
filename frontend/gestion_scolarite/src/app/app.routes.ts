import { Routes } from '@angular/router';
import { LayoutPublic } from './components/layouts/layout-public/layout-public';
import { LayoutAdmin } from './components/layouts/layout-admin/layout-admin';
import { LayoutEtudiant } from './components/layouts/layout-etudiant/layout-etudiant';
import { LayoutEnseignant } from './components/layouts/layout-enseignant/layout-enseignant';

import { Acceuil } from './components/acceuil/acceuil';
import { Registre } from './components/registre/registre';
import { Login } from './components/login/login';
import { Reinisilize } from './components/reinisilize/reinisilize';
import { ResetPassword } from './components/reset-password/reset-password';
import { VerifyMail } from './components/verify-mail/verify-mail';
import { Contact } from './components/contact/contact';
import { formation } from './components/formation/formation';
import { Program } from './components/program/program';
import { APropos } from './components/a-propos/a-propos';
import { RessourceComponent } from './components/ressource/ressource';
import { Calendar } from './components/calendar/calendar';
import { SeeAllDashboard } from './components/see-all-dashboard/see-all-dashboard';
import { AllNews } from './components/all-news/all-news';
import { Schedule } from './components/schedule/schedule';
import { Exam } from './components/exam/exam';
import { Note } from './components/note/note';
import { ExamEtudiant } from './components/exam-etudiant/exam-etudiant';
import { ScheduleEtudiant } from './components/schedule-etudiant/schedule-etudiant';
import { NoteEtudiant } from './components/note-etudiant/note-etudiant';
import { DashboardAdmin } from './components/dashboard-admin/dashboard-admin';
import { CalendarEtudiant } from './components/calendar-etudiant/calendar-etudiant';
import { DashboardEtudiant } from './components/dashboard-etudiant/dashboard-etudiant';
import { DashboardEnseignant } from './components/dashboard-enseignant/dashboard-enseignant';
import { RessourceEtudiant } from './components/ressource-etudiant/ressource-etudiant';
import { FormationEtudiant } from './components/formation-etudiant/formation-etudiant';
import { Departement } from './components/departement/departement';
import { SeeAllDashboardAdmin } from './components/see-all-dashboard-admin/see-all-dashboard-admin';
import { AllNewsAdmin } from './components/all-news-admin/all-news-admin';
import { Home } from './components/home/home';
import { HomeAdmin } from './components/home-admin/home-admin';
import { QuickAccesAdmin } from './components/quick-acces-admin/quick-acces-admin';
import { ActualiteAdmin } from './components/actualite-admin/actualite-admin';
import { Inscription } from './components/inscription/inscription';
import { Validation } from './components/validation/validation';
import { Paiement } from './components/paiement/paiement';
import { Confirmation } from './components/confirmation/confirmation';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublic,
    children: [
      { path: '', component: Acceuil },
      { path: 'registre', component: Registre },
      { path: 'login', component: Login },
      { path: 'reinisilize', component: Reinisilize },
      { path: 'resetpassword', component: ResetPassword },
      { path: 'verifyemail', component: VerifyMail },
      { path: 'contact', component: Contact },
      { path: 'a-propos', component: APropos },
      { path: 'formation', component: formation },
      { path: 'programme', component: Program },
      { path: 'seeAllDashboard', component: SeeAllDashboard },
      { path: 'allNews', component: AllNews },
      { path: 'departement', component: Departement },
      { path: 'inscription', component: Inscription },
      { path: 'validation/:id', component: Validation },
      { path: 'paiement/:id', component: Paiement },
      { path: 'confirmation/:id', component: Confirmation },
    ],
  },
  {
    path: 'admindashboard',
    component: LayoutAdmin,
    children: [
      { path: 'admin', component: DashboardAdmin },
      { path: 'schedule', component: Schedule },
      { path: 'exam', component: Exam },
      { path: 'note', component: Note },
      { path: 'formationEtudiant', component: FormationEtudiant },
      { path: 'seealldasboardadmin', component: SeeAllDashboardAdmin },
      { path: 'allnewadmin', component: AllNewsAdmin },
      { path: 'homeadmin', component: HomeAdmin },
      { path: 'quickacessadmin', component: QuickAccesAdmin },
      { path: 'actualiteadmin', component: ActualiteAdmin },
      { path: 'calendar', component: Calendar },
      { path: 'ressource', component: RessourceComponent },
    ],
  },
  {
    path: 'etudiantdashboard',
    component: LayoutEtudiant,
    children: [
      { path: 'etudiant', component: DashboardEtudiant },
      { path: 'scheduleEtudiant', component: ScheduleEtudiant },
      { path: 'examEtudiant', component: ExamEtudiant },
      { path: 'noteEtudiant', component: NoteEtudiant },
      { path: 'ressourceEtudiant', component: RessourceEtudiant },
      { path: 'calendarEtudiant', component: CalendarEtudiant },
    ],
  },
  {
    path: 'enseignantdashboard',
    component: LayoutEnseignant,
    children: [
      { path: 'enseignant', component: DashboardEnseignant },
      { path: 'scheduleEtudiant', component: ScheduleEtudiant },
      { path: 'examEtudiant', component: ExamEtudiant },
      { path: 'note', component: Note },
      { path: 'ressourceEtudiant', component: RessourceEtudiant },
      { path: 'calendarEtudiant', component: CalendarEtudiant },
    ],
  },
];
