import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AppSettings } from '../../app.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${AppSettings.apiBaseUrl}${AppSettings.loginUrl}`, {
        email,
        password,
      })
      .pipe(tap((res) => localStorage.setItem(AppSettings.tokenStorageKey, res.token)));
  }

  logout() {
    localStorage.removeItem(AppSettings.tokenStorageKey);
  }

  getToken(): string | null {
    return localStorage.getItem(AppSettings.tokenStorageKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
