import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { inject } from '@angular/core';
// RouteGuards om de pagina te beschermen om basis van role
export const authGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

