import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { RegisterUser } from '../../../users/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = null;
    this.success = null;

    const newUser: RegisterUser = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.userService.create(newUser).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Usuário registrado com sucesso!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erro ao registrar usuário';
        console.error(err);
      },
    });
  }
}
