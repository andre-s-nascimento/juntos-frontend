import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  submit(): void {
    this.loading = true;
    this.error = null;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.redirectBasedOnRole(); // ← NOVO: redirecionamento inteligente
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Email ou senha incorretos';
        console.error('Login error:', err);
      },
    });
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']); // Admin vai direto para dashboard
    } else {
      this.router.navigate(['/welcome']); // Usuário comum vai para boas-vindas
    }
  }
}
