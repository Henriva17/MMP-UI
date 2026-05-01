// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthResponse } from '../shared/models/responces/auth-response';
import { LoginRequest } from '../shared/models/requests/login-request';
import { Role } from '../shared/models/enums/role';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.url}/auth`;

  // POST /api/auth/login
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        // save token and role in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId',response.userId.toString());
        localStorage.setItem('fullName', response.fullName);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): Role | null {
     const role = localStorage.getItem('role');
  return role ? (role as Role) : null;
  }

  
  getUserId(): number {
  return Number(localStorage.getItem('userId'));
  }

  getFullName(): string | null {
    return localStorage.getItem('fullName');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}