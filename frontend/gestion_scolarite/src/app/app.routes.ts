import { Routes } from '@angular/router';
import { Acceuil } from './components/acceuil/acceuil';
import { Registre } from './components/registre/registre';
import { Login } from './components/login/login';
import { Reinisilize } from './components/reinisilize/reinisilize';
import { ResetPassword } from './components/reset-password/reset-password';
import { VerifyMail } from './components/verify-mail/verify-mail';

export const routes: Routes = [
    { path:'',component:Acceuil},
    { path:'registre',component:Registre},
    { path:'login',component:Login},
    { path:'reinisilize',component:Reinisilize},
    { path:'resetpassword',component:ResetPassword},
    { path:'verifyemail',component:VerifyMail},



];
