import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reinisilize',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reinisilize.html',
  styleUrl: './reinisilize.css'
})
export class Reinisilize {
  // ✅ propriété pour gérer la visibilité
  isVisible = true;
  requestForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    // Création du formulaire
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter pour accéder facilement aux champs du form
  get f() {
    return this.requestForm.controls;
  }

  close() {
    console.log('Bouton X cliqué');
    this.isVisible = false;
    this.router.navigate(['/login']);
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.requestForm.invalid) return;

    const email = this.f['email'].value;

    this.userService.reinisilize(email).subscribe({
      next: (res) => {
        this.successMessage = res.message || "Code OTP envoyé avec succès.";
        this.errorMessage = '';
        console.log('Réinitialisation - OTP envoyé :', res);
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Erreur lors de l’envoi de l’OTP.";
        this.successMessage = '';
        console.error('Erreur réinitialisation', err);
      }
    });
  }
}
