import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './registre.html',
  styleUrl: './registre.css'
})
export class Registre {
// ✅ propriété pour gérer la visibilité
  isVisible = true;
 registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  close() {
     console.log('Bouton X cliqué');
    this.isVisible = false;
    this.router.navigate(['']);
  }

  onSubmit() {
    if (!this.registerForm.valid) return;
      const newUser = {
        firstName: this.registerForm.get('firstName')?.value as string,
        lastName: this.registerForm.get('lastName')?.value as string,
        email: this.registerForm.get('email')?.value as string,
        password: this.registerForm.get('password')?.value as string,
        role: this.registerForm.get('role')?.value as string,
        isActive: true,
        isEmailVerified: false
      };
      console.log(newUser);
      

      this.userService.register(newUser).subscribe({
        next: res => {
        this.errorMessage = '';
        this.successMessage = res.message || 'Inscription réussie';
        console.log('Inscription réussie', res);
      },
      error: err => {
        this.errorMessage = err.error.error || err.error.message || 'Erreur serveur';
        this.successMessage = '';
        console.error('Erreur inscription', err);
      }
      });
    }
  }
