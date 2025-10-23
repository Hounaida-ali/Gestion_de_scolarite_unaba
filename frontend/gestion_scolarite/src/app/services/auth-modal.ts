import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthModal {
  private loginModalState = new Subject<boolean>();
  private registerModalState = new Subject<boolean>();

  loginModalState$ = this.loginModalState.asObservable();
  registerModalState$ = this.registerModalState.asObservable();

  openLoginModal(): void {
    this.loginModalState.next(true);
  }

  closeLoginModal(): void {
    this.loginModalState.next(false);
  }

  openRegisterModal(): void {
    this.registerModalState.next(true);
  }

  closeRegisterModal(): void {
    this.registerModalState.next(false);
  }
}
