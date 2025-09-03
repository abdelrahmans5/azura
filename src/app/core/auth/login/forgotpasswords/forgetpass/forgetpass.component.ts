import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgetpass',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgetpass.component.html',
  styleUrl: './forgetpass.component.css'
})
export class ForgetpassComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  forgotPasswordForm!: FormGroup;
  msgError: string | null = null;
  msgSuccess: string | null = null;
  isLoading: boolean = false;
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  submitForm(): void {
    if (this.forgotPasswordForm.valid) {
      this.clearMessages();
      this.isLoading = true;
      this.subscription.unsubscribe();

      this.subscription = this.authService.forgotPasswords(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.statusMsg === 'success') {
            this.msgSuccess = 'Verification code sent! Redirecting to code verification...';

            // Navigate to verify code page after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/verify-code']);
            }, 2000);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.msgError = error.error.message || 'An error occurred. Please try again.';
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
      this.msgError = 'Please enter a valid email address.';
    }
  }

  clearMessages(): void {
    this.msgError = null;
    this.msgSuccess = null;
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
