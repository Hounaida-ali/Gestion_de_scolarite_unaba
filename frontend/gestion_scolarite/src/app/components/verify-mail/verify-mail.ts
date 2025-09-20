import { Component } from '@angular/core';
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
  // ✅ propriété pour gérer la visibilité
  isVisible = true;
  verifyForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    // Récupération du otpToken depuis le localStorage
    const otpToken = localStorage.getItem('token') || '';
    console.log('otpToken:', otpToken);
    

    // Initialisation du formulaire
    this.verifyForm = this.fb.group({
      otp: ['', Validators.required],
      otpToken: [otpToken, Validators.required],
      purpose: ['verify-email', Validators.required]
    });

    
  }

   close() {
     console.log('Bouton X cliqué');
    this.isVisible = false;
    this.router.navigate(['']);
  }

  onSubmit() {
    if (!this.verifyForm.valid) return;

    this.userService.verifyEmail(this.verifyForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la vérification';
        this.successMessage = '';
      }
    });
  }
}

