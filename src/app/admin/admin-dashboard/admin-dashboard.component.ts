import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterUser, User } from '../../users/user.model';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Formulário de criação/edição
  selectedUser: Partial<RegisterUser & { id?: string }> = {};
  isEditing = false;
  formError: string | null = null;
  formSuccess: string | null = null;

  constructor(private readonly userService: UserService, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.listAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
      },
    });
  }

  selectUser(user: User) {
    this.isEditing = true;
    this.selectedUser = { ...user, password: '' }; // senha vazia para editar
  }

  clearForm() {
    this.isEditing = false;
    this.selectedUser = {};
    this.formError = null;
    this.formSuccess = null;
  }

  submit() {
    if (!this.selectedUser.name || !this.selectedUser.email) {
      this.formError = 'Nome e email são obrigatórios';
      return;
    }

    const payload: any = {
      name: this.selectedUser.name!,
      email: this.selectedUser.email!,
      role: this.selectedUser.role || 'USER',
    };

    if (this.selectedUser.password && this.selectedUser.password.trim() !== '') {
      payload.password = this.selectedUser.password;
    }

    if (this.isEditing && this.selectedUser.id) {
      this.userService.update(this.selectedUser.id, payload).subscribe({
        next: () => {
          this.formSuccess = 'Usuário atualizado com sucesso';
          this.clearForm();
          this.loadUsers();
        },
        error: (error) => {
          this.formError = error.error?.error || 'Erro ao atualizar usuário';
          console.error('Update error:', error);
        },
      });
    } else {
      // Criação de usuário (mantém igual)
      if (!this.selectedUser.password) {
        this.formError = 'Senha é obrigatória para novo usuário';
        return;
      }

      const createFn =
        payload.role === 'ADMIN'
          ? this.userService.createAdmin.bind(this.userService)
          : this.userService.create.bind(this.userService);

      createFn(payload).subscribe({
        next: () => {
          this.formSuccess = 'Usuário criado com sucesso';
          this.clearForm();
          this.loadUsers();
        },
        error: (error) => {
          this.formError = error.error?.error || 'Erro ao criar usuário';
          console.error('Create error:', error);
        },
      });
    }
  }

  /*   deleteUser(id?: string) {
    if (!id) return;
    if (!confirm('Confirmar exclusão do usuário?')) return;

    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Erro ao deletar usuário'),
    });
  } */
}
