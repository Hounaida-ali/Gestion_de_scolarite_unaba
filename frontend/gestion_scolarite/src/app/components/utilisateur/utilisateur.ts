import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../interfaces/userInterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-utilisateur',
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateur.html',
  styleUrl: './utilisateur.css',
})
export class Utilisateur {
  users: User[] = [];
  selectedUser: User = {} as User;
  showUserForm = false;
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => (this.users = data),
      error: (err) => (this.errorMessage = 'Erreur lors du chargement des utilisateurs'),
    });
  }

  newUser() {
    this.selectedUser = {} as User;
    this.showUserForm = true;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.showUserForm = true;
  }
  
  saveUser(): void {
    if (!this.selectedUser) return;

    // ✅ Vérification des champs requis
    if (
      !this.selectedUser.firstName ||
      !this.selectedUser.lastName ||
      !this.selectedUser.email ||
      !this.selectedUser.role
    ) {
      this.showMessage('Tous les champs obligatoires doivent être remplis.', 'error');
      return;
    }

    const isUpdate = !!this.selectedUser._id;

    if (isUpdate) {
      // Mise à jour
      this.userService.update(this.selectedUser._id!, this.selectedUser).subscribe({
        next: (res: any) => {
          const message = res?.message ?? 'Utilisateur mis à jour avec succès';
          const updatedUser = res?.data ?? res;

          if (res?.success === false) {
            this.showMessage(message, 'error'); // ⚠️ message d'erreur
          } else {
            const index = this.users.findIndex((u) => u._id === this.selectedUser!._id);
            if (index !== -1) this.users[index] = updatedUser;
            
            // ✅ CORRECTION : fermer le formulaire AVANT d'afficher le message
            this.selectedUser = {} as User;
            this.showUserForm = false;
            this.showMessage(message, 'success');
          }
        },
        error: (err: any) => {
          const message = err?.error?.message ?? 'Erreur lors de la mise à jour';
          this.showMessage(message, 'error');
        },
      });
    } else {
      // Création
      this.userService.create(this.selectedUser).subscribe({
        next: (res: any) => {
          const message = res?.message ?? 'Utilisateur ajouté avec succès';
          const newUser = res?.data ?? res.user ?? res;

          this.users.push(newUser);
          
          // ✅ CORRECTION : fermer le formulaire AVANT d'afficher le message
          this.selectedUser = {} as User;
          this.showUserForm = false;
          this.showMessage(message, 'success');
        },
        error: (err: any) => {
          const message = err?.error?.message ?? "Erreur lors de l'ajout";
          this.showMessage(message, 'error');
        },
      });
    }
  }

  deleteUser(user: User) {
    if (!user._id) return;
    if (!confirm(`Voulez-vous vraiment supprimer ${user.firstName} ${user.lastName} ?`)) return;

    this.userService.delete(user._id).subscribe({
      next: (res: any) => {
        const success = res.success !== false; // forcer true si undefined
        this.showMessage(res.message, success ? 'success' : 'error');
        if (success) {
          this.users = this.users.filter((u) => u._id !== user._id);
        }
      },
      error: (err: any) => {
        const message = err?.error?.message || 'Erreur lors de la suppression';
        this.showMessage(message, 'error');
      },
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ''), 3000);
    } else {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  resetForm() {
    this.selectedUser = {} as User;
    this.showUserForm = false;
  }
}