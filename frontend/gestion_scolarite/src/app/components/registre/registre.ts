import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthModal } from '../../services/auth-modal';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registre.html',
  styleUrl: './registre.css',
})
export class Registre {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authModalService: AuthModal
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  // Ferme la modal de Register
  closeRegisterModal(): void {
    this.authModalService.closeRegisterModal();
  }

  // ✅ Empêche la propagation du clic dans la modal
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  // ✅ Soumission du formulaire
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const newUser = {
      firstName: this.f['firstName'].value as string,
      lastName: this.f['lastName'].value as string,
      email: this.f['email'].value as string,
      password: this.f['password'].value as string,
      role: this.f['role'].value as string,
      isActive: true,
      isEmailVerified: false,
    };

    console.log('Nouvel utilisateur :', newUser);

    this.userService.register(newUser).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.successMessage = res.message || 'Inscription réussie';
        console.log('Inscription réussie', res);
        // Optionally, close modal automatically after success
        // setTimeout(() => this.closeModal(), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || err.error?.message || 'Erreur serveur';
        this.successMessage = '';
        console.error('Erreur inscription', err);
      },
    });
  }
}
