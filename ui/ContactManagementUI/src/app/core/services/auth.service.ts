import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { environment } from '../environments/environment';

interface AuthResponse {
  token: string;
  username: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private router: Router,
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}

  login(data: FormGroup) {
    this.apiService
      .post<AuthResponse>(`/users/login`, data.value)
      .subscribe({
        next: (response) => {
          this.tokenService.setToken(response.token);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
  }

  register(data: FormGroup) {
    this.apiService
      .post<AuthResponse>(`/users/register`, data.value, true)
      .subscribe({
        next: (response) => {
          this.tokenService.setToken(response.token);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/']);
  }

  isLoggedIn = (): boolean => this.tokenService.getToken() !== null;

}
