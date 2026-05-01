import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../shared/models/enums/role';
import { inject } from '@angular/core';
import { AuthService } from '../../services/AuthService';

export const chooseRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getRole();

  //  not logged in → go to login
  if (!authService.isLoggedIn()) {
    router.navigate(['/complete-profile']);
    return false;
  }

  //  already promoted → redirect to their dashboard
  if (role === Role.STUDENT) {
    router.navigate(['/student/dashboard']);
    return false;
  }

  if (role === Role.COMPANY) {
    router.navigate(['/company/dashboard']);
    return false;
  }

  //  role is USER → allowed to choose
  return true;
};