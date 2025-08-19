import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If the error is due to an expired token and not on the refresh endpoint
        if (!req.url.includes('auth/refresh')) {
          // Try to refresh the token
          authService.refreshToken().subscribe({
            next: () => {
              // Retry the original request
              window.location.reload();
            },
            error: () => {
              // If refresh fails, log out the user
              authService.logout();
              router.navigate(['/auth/login']);
              toastr.error('Your session has expired. Please log in again.');
            }
          });
        } else {
          // If the refresh token itself is invalid, log out the user
          authService.logout();
          router.navigate(['/auth/login']);
          toastr.error('Your session has expired. Please log in again.');
        }
      } else if (error.status === 403) {
        toastr.error('You do not have permission to perform this action.');
      } else if (error.status === 404) {
        toastr.error('The requested resource was not found.');
      } else if (error.status >= 500) {
        toastr.error('A server error occurred. Please try again later.');
      } else {
        // Handle other errors
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        toastr.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};