import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RegisterUser, User } from '../../users/user.model';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Controle de visualização
  showForm = false;
  isEditing = false;

  // Formulário
  selectedUser: Partial<RegisterUser & { id?: string }> = {};
  formError: string | null = null;
  formSuccess: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService
      .listAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar usuários';
          this.loading = false;
          console.error('Load users error:', error);
        },
      });
  }

  showList(): void {
    this.showForm = false;
    this.isEditing = false;
    this.selectedUser = {};
    this.clearFormMessages();
  }

  showCreateForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.selectedUser = { role: 'USER' };
    this.clearFormMessages();
  }

  showEditForm(user: User): void {
    this.showForm = true;
    this.isEditing = true;
    this.selectedUser = {
      ...user,
      password: '', // Senha vazia para edição
    };
    this.clearFormMessages();
  }

  submit(): void {
    this.clearFormMessages();

    if (!this.validateForm()) {
      return;
    }

    const payload = this.buildPayload();

    if (this.isEditing && this.selectedUser.id) {
      this.updateUser(this.selectedUser.id, payload);
    } else {
      this.createUser(payload);
    }
  }

  private validateForm(): boolean {
    if (!this.selectedUser.name?.trim() || !this.selectedUser.email?.trim()) {
      this.formError = 'Nome e email são obrigatórios';
      return false;
    }

    if (!this.isEditing && !this.selectedUser.password?.trim()) {
      this.formError = 'Senha é obrigatória para novo usuário';
      return false;
    }

    return true;
  }

  private buildPayload(): any {
    const payload: any = {
      name: this.selectedUser.name!.trim(),
      email: this.selectedUser.email!.trim(),
      role: this.selectedUser.role || 'USER',
    };

    // Incluir senha apenas se fornecida e não vazia
    if (this.selectedUser.password?.trim()) {
      payload.password = this.selectedUser.password.trim();
    }

    return payload;
  }

  private updateUser(userId: string, payload: any): void {
    this.loading = true;

    this.userService
      .update(userId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccess('Usuário atualizado com sucesso!');
        },
        error: (error) => {
          this.handleError(error, 'Erro ao atualizar usuário');
        },
      });
  }

  private createUser(payload: any): void {
    this.loading = true;

    // Verificar se a senha está presente
    if (!payload.password) {
      console.error('❌ Senha não encontrada no payload');
      this.formError = 'Senha é obrigatória';
      this.loading = false;
      return;
    }

    const createFn =
      payload.role === 'ADMIN'
        ? this.userService.createAdmin.bind(this.userService)
        : this.userService.create.bind(this.userService);

    createFn(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccess('Usuário criado com sucesso!');
          setTimeout(() => this.showList(), 1500);
        },
        error: (error) => {
          console.error('❌ Erro na criação:', error); // ← DEBUG
          this.handleError(error, 'Erro ao criar usuário');
        },
      });
  }

  private handleSuccess(message: string): void {
    this.formSuccess = message;
    this.loading = false;
    this.loadUsers();
  }

  private handleError(error: any, defaultMessage: string): void {
    this.formError = error.error?.error || defaultMessage;
    this.loading = false;
    console.error('Operation error:', error);
  }

  private clearFormMessages(): void {
    this.formError = null;
    this.formSuccess = null;
  }
}
