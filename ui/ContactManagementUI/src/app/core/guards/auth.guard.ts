import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const isTokenExpired = Date.now() >= tokenPayload.exp * 1000;
    if (isTokenExpired) {
      tokenService.removeToken();
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    tokenService.removeToken();
    router.navigate(['/login']);
    return false;
  }
};
