import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-mail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-mail.html',
  styleUrl: './verify-mail.css'
})
export class VerifyMail {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  verifyForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const otpToken = localStorage.getItem('token') || '';
    console.log('otpToken:', otpToken);

    this.verifyForm = this.fb.group({
      otp: ['', Validators.required],
      otpToken: [otpToken, Validators.required],
      purpose: ['verify-email', Validators.required]
    });
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
    if (this.verifyForm.invalid) return;

    this.userService.verifyEmail(this.verifyForm.value).subscribe({
      next: res => {
        this.successMessage = res.message || 'Email vérifié avec succès.';
        this.errorMessage = '';
        console.log('Vérification réussie :', res);
        // Optionnel : fermer modal après succès
        // setTimeout(() => this.closeModal(), 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Erreur lors de la vérification de l’email.';
        this.successMessage = '';
        console.error('Erreur vérification :', err);
      }
    });
  }
}

