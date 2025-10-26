import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  userName: string = 'Usuário';
  userRole: string = 'USER';
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.userName = user.email?.split('@')[0] || 'Usuário'; // Pega a parte antes do @
      this.userRole = user.role || 'USER';
      this.isAdmin = this.authService.isAdmin();
    } else {
      // Fallback: tenta extrair do token diretamente
      const token = this.authService.getToken();
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          this.userName = decoded.sub?.split('@')[0] || 'Usuário';
          this.userRole = decoded.role || 'USER';
          this.isAdmin = this.userRole === 'ADMIN';
        } catch {
          this.userName = 'Usuário';
          this.userRole = 'USER';
          this.isAdmin = false;
        }
      }
    }
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToUsers(): void {
    this.router.navigate(['/users']);
  }
}
