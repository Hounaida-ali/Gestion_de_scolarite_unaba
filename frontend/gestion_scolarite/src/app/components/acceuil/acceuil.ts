import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Hero } from '../hero/hero';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-acceuil',
  imports: [CommonModule, Hero, Dashboard],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class Acceuil {}
