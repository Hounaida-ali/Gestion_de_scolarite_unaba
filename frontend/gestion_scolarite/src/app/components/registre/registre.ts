import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registre.html',
  styleUrl: './registre.css'
})
export class Registre {
 registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
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
        next: res => console.log('Inscription réussie ', res),
        error: err => console.error('Erreur inscription ', err)
      });
    }
  }
}