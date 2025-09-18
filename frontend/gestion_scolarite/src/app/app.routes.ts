import { Routes } from '@angular/router';
import { Acceuil } from './components/acceuil/acceuil';
import { Registre } from './components/registre/registre';
import { Login } from './components/login/login';

export const routes: Routes = [
    { path:'',component:Acceuil},
    { path:'registre',component:Registre},
    { path:'login',component:Login},


];
