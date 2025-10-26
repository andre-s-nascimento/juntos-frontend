import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { WelcomeComponent } from './auth/components/welcome/welcome.component';
import { LandingComponent } from './home/components/landing/landing.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserListComponent } from './users/components/user-list/user-list.component';
import { AccessDeniedComponent } from './home/components/access-denied/access-denied.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard, RoleGuard], // ← ADICIONAR RoleGuard
    data: { role: 'ADMIN' }, // ← SOMENTE ADMIN pode acessar
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
  },
  { path: '**', redirectTo: '' },
];
