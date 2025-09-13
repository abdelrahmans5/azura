import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('token');

  if (token) {
    // Check if it's a Google token (special handling)
    if (token.startsWith('google_')) {
      console.log('Google authentication detected, allowing access');
      return true;
    }
    // Regular token
    return true;
  }
  else {
    return router.parseUrl('/login');
  }
}
