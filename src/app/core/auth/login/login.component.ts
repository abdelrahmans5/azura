import { Subscription } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../../../shared/components/input/input.component";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)
  private readonly cookieService = inject(CookieService)

  ngOnInit(): void {
    this.initForm();
    if (this.cookieService.get('token')) {
      this.authService.verifyToken().subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          this.cookieService.delete('token');
        }
      });
    }
  }

  subscription: Subscription = new Subscription();
  msgError: string | null = null;
  isLoading: boolean = false;
  loginForm!: FormGroup;
  eyeFlag: boolean = true;

  initForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)]]
    })
  }


  submitForm(): void {
    if (this.loginForm.valid) {
      this.subscription.unsubscribe();
      this.isLoading = true;

      this.subscription = this.authService.loginForm(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            this.cookieService.set('token', response.token);
            this.router.navigate(['/home']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.msgError = error.error.message;
          this.isLoading = false;
        }
      });

    }
    else {
      this.loginForm.markAllAsTouched();
      this.msgError = 'Form is invalid';
    }

  }
  forgotPasswords(): void {
    this.authService.forgotPasswords(this.loginForm.value.email).subscribe({
      next: (response) => {
        if (response.message === 'success') {
          this.msgError = 'Please check your email for reset password instructions.';
        }
      },
      error: (error) => {
        this.msgError = error.error.message;
      }
    });
  }
}
