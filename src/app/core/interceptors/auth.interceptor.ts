import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip interceptor for auth endpoints
  if (req.url.includes('auth/login') || req.url.includes('auth/register') || req.url.includes('auth/refresh')) {
    return next(req);
  }

  // Get the token from the auth service
  const token = authService.getAccessToken();
  
  // If token exists, clone the request and add the authorization header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  // If no token, proceed with the original request
  return next(req);
};