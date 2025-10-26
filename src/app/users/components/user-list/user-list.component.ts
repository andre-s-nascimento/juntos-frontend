import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../users/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService, public router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.userService.listAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao listar usuários';
        this.loading = false;
      },
    });
  }

  edit(userId?: string) {
    if (!userId) return;
    this.router.navigate(['/admin'], { queryParams: { id: userId } });
  }

  /*   delete(userId?: string) {
    if (!userId) return;
    if (!confirm('Confirmar exclusão?')) return;

    this.userService.delete(userId).subscribe({
      next: () => this.load(),
      error: () => alert('Erro ao deletar usuário'),
    });
  } */
}
