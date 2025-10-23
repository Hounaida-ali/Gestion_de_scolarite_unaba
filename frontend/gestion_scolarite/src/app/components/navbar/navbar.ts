import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthModal } from '../../services/auth-modal';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private authModalService: AuthModal) {}

  openLoginModal(): void {
    this.authModalService.openLoginModal();
  }

  // Ouvre la modal de Register
  openRegisterModal(): void {
    this.authModalService.openRegisterModal();
  }
}
