import { Component } from '@angular/core';
import { AuthAdminService } from '../../services/auth-admin-service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-interceptor',
  imports: [],
  templateUrl: './interceptor.html',
  styleUrl: './interceptor.css'
})
export class Interceptor {
constructor(private authService: AuthAdminService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
