import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StatistiquesGraphiques } from '../../statistiques-graphiques/statistiques-graphiques';
import { Listeinscription } from '../../listeinscription/listeinscription';

@Component({
  selector: 'app-layout-admin',
  imports: [RouterOutlet,RouterLink,
  ],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css'
})
export class LayoutAdmin {

}
