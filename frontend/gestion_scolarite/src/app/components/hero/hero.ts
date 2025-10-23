import { Component } from '@angular/core';
import { AuthModal } from '../../services/auth-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  isLoginModalVisible: boolean = false;
  private modalSubscription: Subscription;

  constructor(private authModalService: AuthModal) {
    this.modalSubscription = this.authModalService.loginModalState$.subscribe((isOpen) => {
      this.isLoginModalVisible = isOpen;
    });
  }

  // Ouvre la modal de login
  openLoginModal(): void {
    this.authModalService.openLoginModal();
  }
}
