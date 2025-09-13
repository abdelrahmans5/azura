import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    let errorMessage = 'Something went wrong';

    // Handle specific error status codes
    switch (error.status) {
      case 401:
        router.navigate(['/login']);
        break;
      case 403:
        errorMessage = 'Access denied';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later';
        break;
      default:
        errorMessage = error?.error?.message || errorMessage;
    }

    // Don't show error toast for certain endpoints or status codes that should be handled silently
    const silentEndpoints = ['/wishlist', '/cart'];
    const shouldShowError = !silentEndpoints.some(endpoint => req.url.includes(endpoint)) || error.status !== 401;

    if (shouldShowError) {
      console.log(errorMessage);
    }

    return throwError(() => error);
  }));
};
