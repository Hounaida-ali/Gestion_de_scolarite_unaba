import { Component } from '@angular/core';
import { ContactService } from '../../services/contact-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contactForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.contactService.saveMessage(this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = 'Votre message a été envoyé avec succès ! nous vous repondrons';
        this.errorMessage = '';
        this.contactForm.reset();
      },
      error: () => {
        this.errorMessage = ' Une erreur est survenue. Réessayez plus tard.';
        this.successMessage = '';
      }
    });
  }
}
