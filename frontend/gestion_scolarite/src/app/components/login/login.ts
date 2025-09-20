import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
// ✅ propriété pour gérer la visibilité
  isVisible = true;

  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
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
  close() {
     console.log('Bouton X cliqué');
    this.isVisible = false;
    this.router.navigate(['']);
  }

  onSubmit() {
    if (!this.loginForm.valid) return;
    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.userService.login(email, password).subscribe({
      next: res => {
        this.errorMessage = '';
        this.successMessage = res.message || 'Connexion réussie';
        console.log('Connexion réussie', res);
      },
      error: (err: any) => {
        this.errorMessage = err.error.error || err.error.message || 'Erreur de connexion';
        this.successMessage = '';
        console.error('Erreur de connexion', err);
      }
    });
  }
}


