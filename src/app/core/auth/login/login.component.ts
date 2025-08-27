import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)

  msgError: string | null = null;
  isLoading: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)]]
  })


  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.loginForm(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
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
      this.msgError = 'Form is invalid';
    }

  }

}
