import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'technicians',
    loadChildren: () =>
      import('./features/technicians/technicians.routes').then(
        (m) => m.TECHNICIANS_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'work-orders',
    loadChildren: () =>
      import('./features/work-orders/work-orders.routes').then(
        (m) => m.WORK_ORDERS_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
