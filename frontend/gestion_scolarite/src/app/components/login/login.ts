import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  // ✅ méthode pour fermer la modal
  closeModal(): void {
    console.log('Fermeture de la modal');
    this.close.emit();
  }

  // Empêche la propagation du clic dans la modal
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  onSubmit(): void {
  if (!this.loginForm.valid) return;

  const email = this.f['email'].value;
  const password = this.f['password'].value;
  const role = this.f['role'].value; // récupérer le rôle sélectionné

  this.userService.login(email, password).subscribe({
    next: res => {
      this.errorMessage = '';
      this.successMessage = res.message || 'Connexion réussie';
      console.log('Connexion réussie', res);

      // 🔹 Redirection selon le rôle
      switch (role) {
        case 'admin':
          this.router.navigate(['admindashboard']);
          break;
        case 'teacher':
          this.router.navigate(['enseignantdashboard']);
          break;
        case 'student':
          this.router.navigate(['etudiantdashboard']);
          break;
        default:
          this.router.navigate(['']); // redirection par défaut
      }

      // Optionnel : fermer la modal après redirection
      this.closeModal();
    },
    error: (err: any) => {
      this.errorMessage = err.error.error || err.error.message || 'Erreur de connexion';
      this.successMessage = '';
      console.error('Erreur de connexion', err);
    }
  });
}

}
