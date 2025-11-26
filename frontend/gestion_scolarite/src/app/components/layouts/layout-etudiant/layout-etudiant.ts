import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EtudiantService } from '../../../services/etudiant-service';

@Component({
  selector: 'app-layout-etudiant',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout-etudiant.html',
  styleUrl: './layout-etudiant.css',
})
export class LayoutEtudiant {
  isRegistered: boolean = false;

  constructor(private etudiantService: EtudiantService) {}

  ngOnInit() {
    this.etudiantService.checkRegistration().subscribe((value) => {
      console.log(value);

      this.isRegistered = value;
    });
  }
}
