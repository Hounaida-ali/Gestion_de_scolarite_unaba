import { Component } from '@angular/core';
import { EnseignantService } from '../../services/enseignant-service';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-enseignant-guard',
  imports: [],
  templateUrl: './enseignant-guard.html',
  styleUrl: './enseignant-guard.css',
})
export class EnseignantGuard {
constructor(
    private enseignantService: EnseignantService,
    private router: Router
  ) {}

  canActivate() {
    return this.enseignantService.currentEnseignant$.pipe(
      take(1),
      map(enseignant => {
        if (enseignant) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
