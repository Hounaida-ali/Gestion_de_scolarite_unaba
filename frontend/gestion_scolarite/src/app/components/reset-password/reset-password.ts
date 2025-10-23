import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
 @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  resetForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const otpToken = localStorage.getItem('token') || '';
    console.log('otpToken récupéré :', otpToken);

    this.resetForm = this.fb.group({
      otp: ['', Validators.required],
      otpToken: [otpToken, Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ✅ Ferme la modal
  closeModal(): void {
    this.close.emit();
  }

  // ✅ Empêche la propagation du clic
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  // ✅ Soumission du formulaire
  onSubmit(): void {
    if (this.resetForm.invalid) return;

    const { otp, otpToken, newPassword } = this.resetForm.value;

    this.userService.resetPassword(otp, otpToken, newPassword).subscribe({
      next: res => {
        this.successMessage = res.message || 'Mot de passe réinitialisé avec succès.';
        this.errorMessage = '';
        console.log('Réinitialisation réussie :', res);
        // Optionnel : fermer modal après succès
        // setTimeout(() => this.closeModal(), 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur lors de la réinitialisation.';
        this.successMessage = '';
        console.error('Erreur reset password :', err);
      }
    });
  }
}

