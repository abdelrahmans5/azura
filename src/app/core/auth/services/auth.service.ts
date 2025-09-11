import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { get } from 'http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  registerForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/signup', data);
  }
  loginForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/signin', data);
  }
  logout(): void {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }

  private getHeaders(): object {
    const token = this.cookieService.get('token');
    return {
      headers: {
        token: token
      }
    };
  }

  decodeToken() {
    let token;
    try {
      token = jwtDecode(this.cookieService.get('token'));
    } catch (error) {
      this.logout();
    }
    return token;
  }
  verifyToken() {
    return this.httpClient.get(environment.baseUrl + 'auth/verifyToken');
  }

  forgotPasswords(email: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/forgotPasswords', {
      email: email
    });
  }
  verifyResetCode(code: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/verifyResetCode', {
      resetCode: code
    });
  }
  changeMyPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/changeMyPassword', {
      currentPassword: currentPassword,
      password: newPassword,
      rePassword: newPassword
    });
  }
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'auth/resetPassword', {
      email: email,
      newPassword: newPassword
    });
  }
  updateMe(name: string, email: string, phone: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/updateMe/',
      {
        name: name,
        email: email,
        phone: phone
      });
  }

  googleLogin(googleData: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/google-login', googleData);
  }
}
