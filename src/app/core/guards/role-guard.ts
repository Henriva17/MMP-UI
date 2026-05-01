import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  

  const expectedRole = route.data['role']; // role passed from route definition
  const userRole = authService.getRole();


  if (userRole === expectedRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
