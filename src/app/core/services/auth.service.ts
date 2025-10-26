import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject } from 'rxjs';
import { AppSettings } from '../../app.config';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private readonly http: HttpClient) {
    this.loadUserFromToken();
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${AppSettings.apiBaseUrl}${AppSettings.loginUrl}`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(AppSettings.tokenStorageKey, res.token);
          this.loadUserFromToken();
        })
      );
  }

  logout() {
    localStorage.removeItem(AppSettings.tokenStorageKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(AppSettings.tokenStorageKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentUserSubject.next({
          email: decoded.sub,
          role: decoded.role,
        });
      } catch {
        this.logout();
      }
    }
  }
}
