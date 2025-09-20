import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  // ✅ propriété pour gérer la visibilité
  isVisible = true;
  resetForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
    
    // Récupération du otpToken depuis le localStorage
    const otpToken = localStorage.getItem('token') || '';
    console.log('otpToken:', otpToken);
    // Initialisation du formulaire
    this.resetForm = this.fb.group({
      otp: ['', Validators.required],
      otpToken: [otpToken, Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  close() {
    console.log('Bouton X cliqué');
    this.isVisible = false;
    this.router.navigate(['/login']);
  }

  // Soumission du formulaire

  onSubmit() {
    if (!this.resetForm.valid) return;
    const { otp, otpToken, newPassword } = this.resetForm.value;

    this.userService.resetPassword(otp, otpToken, newPassword).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la réinitialisation';
        this.successMessage = '';
      }
    });
  }
}

