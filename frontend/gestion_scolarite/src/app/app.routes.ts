import { Routes } from '@angular/router';
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
import { Ressource } from './components/ressource/ressource';
import { Calendar } from './components/calendar/calendar';
import { SeeAllDashboard } from './components/see-all-dashboard/see-all-dashboard';
import { AllNews } from './components/all-news/all-news';

export const routes: Routes = [
    { path:'',component:Acceuil},
    { path:'registre',component:Registre},
    // { path:'login',component:Login},
    { path:'reinisilize',component:Reinisilize},
    { path:'resetpassword',component:ResetPassword},
    { path:'verifyemail',component:VerifyMail},
    { path:'contact',component:Contact},
    { path:'a-propos',component:APropos},
    { path:'formation',component:formation},
    { path:'programme',component:Program},
    { path:'ressource',component:Ressource},
    { path:'calendar',component:Calendar},
];
