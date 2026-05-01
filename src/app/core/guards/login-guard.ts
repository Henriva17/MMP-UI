import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../services/AuthService";
import { inject } from "@angular/core";
import { Role } from "../../shared/models/enums/role";


export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // 👈 not logged in → allow access to login page
  }

  const role = authService.getRole();

  if (role === Role.STUDENT) {
    router.navigate(['/student/dashboard']);
    return false;
  }

  if (role === Role.COMPANY) {
    router.navigate(['/company/dashboard']);
    return false;
  }

  if (role === Role.USER) {
    router.navigate(['/choose-role']);
    return false;
  }

  return true;
};