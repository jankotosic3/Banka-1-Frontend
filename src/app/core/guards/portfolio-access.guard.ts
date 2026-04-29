import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const portfolioAccessGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.canAccessPortfolio()) {
    router.navigate(['/403']);
    return false;
  }

  return true;
};
