import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Subscription } from 'rxjs';
import { AuthModal } from './services/auth-modal';
import { Login } from "./components/login/login";
import { Registre } from "./components/registre/registre";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Login, Registre],
  template: ` <app-navbar></app-navbar>

    <!-- Login Modal -->
    @if (isLoginModalVisible) {
    <div class="modal-backdrop show" (click)="closeLoginModal()"></div>
    <div class="modal show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <app-login [isVisible]="isLoginModalVisible" (close)="onLoginModalClose()"> </app-login>
        </div>
      </div>
    </div>
    }

    <!-- Register Modal -->
    @if (isRegisterModalVisible) {
    <div class="modal-backdrop show" (click)="closeRegisterModal()"></div>
    <div class="modal show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <app-registre [isVisible]="isRegisterModalVisible" (close)="onRegisterModalClose()">
          </app-registre>
        </div>
      </div>
    </div>
    }
    <router-outlet />
    <app-footer></app-footer>`,
  styles: '',
})
export class App {
  protected readonly title = signal('gestion_scolarite');

  isLoginModalVisible: boolean = false;
  isRegisterModalVisible: boolean = false;
  private modalSubscription: Subscription;

  constructor(private authModalService: AuthModal) {
    this.modalSubscription = this.authModalService.loginModalState$.subscribe((isOpen) => {
      this.isLoginModalVisible = isOpen;
    });
    this.modalSubscription = this.authModalService.registerModalState$.subscribe((isOpen) => {
      this.isRegisterModalVisible = isOpen;
    });
  }

  ngOnInit(): void {}

  // Ouvre la modal de login
  openLoginModal(): void {
    this.authModalService.openLoginModal();
  }

  // Ferme la modal de login
  closeLoginModal(): void {
    this.authModalService.closeLoginModal();
  }

  // Gère la fermeture de la modal depuis le composant login
  onLoginModalClose(): void {
    this.authModalService.closeLoginModal();
  }

  // Ouvre la modal de Register
  openRegisterModal(): void {
    this.authModalService.openRegisterModal();
  }

  // Ferme la modal de Register
  closeRegisterModal(): void {
    this.authModalService.closeRegisterModal();
  }

  // Gère la fermeture de la modal depuis le composant login
  onRegisterModalClose(): void {
    this.authModalService.closeRegisterModal();
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
