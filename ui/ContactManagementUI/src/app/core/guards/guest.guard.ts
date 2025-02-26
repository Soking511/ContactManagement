import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const guestGuard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token) {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const isTokenExpired = Date.now() >= tokenPayload.exp * 1000;

      if (!isTokenExpired) {
        router.navigate(['/']);
        return false;
      }
    } catch (error) {
      tokenService.removeToken();
    }
  }

  return true;
};
