import { jwtDecode } from 'jwt-decode';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const expectedRole = route.data['role'];
    return decoded.role === expectedRole;
  } catch {
    return false;
  }
};
