import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
   @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  requestForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.requestForm.controls;
  }

  // ✅ Ferme la modal
  closeModal(): void {
    this.close.emit();
  }

  // ✅ Empêche la propagation du clic dans la modal
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  // ✅ Soumission du formulaire
  onSubmit(): void {
    if (this.requestForm.invalid) return;

    const email = this.f['email'].value;

    this.userService.reinisilize(email).subscribe({
      next: res => {
        this.successMessage = res.message || 'Code OTP envoyé avec succès.';
        this.errorMessage = '';
        console.log('Réinitialisation - OTP envoyé :', res);
        // Optionnel : fermer modal après succès
        // setTimeout(() => this.closeModal(), 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur lors de l’envoi de l’OTP.';
        this.successMessage = '';
        console.error('Erreur réinitialisation :', err);
      }
    });
  }
}