import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Subscription } from 'rxjs';
import { AuthModal } from './services/auth-modal';
import { Login } from './components/login/login';
import { Registre } from './components/registre/registre';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer, Login, Registre],
  template: `
    <!-- Navbar & Footer pour public uniquement -->
    <app-navbar *ngIf="!isAdminRoute && !isEtudiantRoute && !isEnseignantRoute"></app-navbar>

    <!-- Login Modal -->
    <div *ngIf="isLoginModalVisible && !isAdminRoute" class="modal-backdrop show" (click)="closeLoginModal()"></div>
    <div *ngIf="isLoginModalVisible && !isAdminRoute" class="modal show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <app-login [isVisible]="isLoginModalVisible" (close)="onLoginModalClose()"></app-login>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div *ngIf="isRegisterModalVisible && !isAdminRoute" class="modal-backdrop show" (click)="closeRegisterModal()"></div>
    <div *ngIf="isRegisterModalVisible && !isAdminRoute" class="modal show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <app-registre [isVisible]="isRegisterModalVisible" (close)="onRegisterModalClose()"></app-registre>
        </div>
      </div>
    </div>

    <!-- Route outlet -->
    <router-outlet></router-outlet>

    <!-- Footer pour public uniquement -->
    <app-footer *ngIf="!isAdminRoute && !isEtudiantRoute && !isEnseignantRoute"></app-footer>
  `,
})
export class App {
  protected readonly title = signal('gestion_scolarite');

  isLoginModalVisible = false;
  isRegisterModalVisible = false;
  private modalSubscription: Subscription;
  isAdminRoute = false;
  isEtudiantRoute = false;
  isEnseignantRoute = false;

  constructor(private authModalService: AuthModal, private router: Router) {
    // Gestion modales Login/Register
    this.modalSubscription = this.authModalService.loginModalState$.subscribe(
      (isOpen) => (this.isLoginModalVisible = isOpen)
    );
    this.modalSubscription = this.authModalService.registerModalState$.subscribe(
      (isOpen) => (this.isRegisterModalVisible = isOpen)
    );

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isAdminRoute = url.startsWith('/admindashboard');
        this.isEtudiantRoute = url.startsWith('/etudiantdashboard');
        this.isEnseignantRoute = url.startsWith('/enseignantdashboard');
      });
  }

  // --- Gestion des modales ---
  openLoginModal(): void { this.authModalService.openLoginModal(); }
  closeLoginModal(): void { this.authModalService.closeLoginModal(); }
  onLoginModalClose(): void { this.authModalService.closeLoginModal(); }
  openRegisterModal(): void { this.authModalService.openRegisterModal(); }
  closeRegisterModal(): void { this.authModalService.closeRegisterModal(); }
  onRegisterModalClose(): void { this.authModalService.closeRegisterModal(); }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
