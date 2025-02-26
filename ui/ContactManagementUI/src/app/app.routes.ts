import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./features/contacts/contacts.component').then((c) => c.ContactsComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full',
  },
];
