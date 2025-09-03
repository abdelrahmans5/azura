import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetpass',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetpass.component.html',
  styleUrl: './resetpass.component.css'
})
export class ResetpassComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);

  resetPasswordForm!: FormGroup;
  msgError: string | null = null;
  msgSuccess: string | null = null;
  isLoading: boolean = false;
  subscription: Subscription = new Subscription();

  // Password visibility toggles
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Email from previous steps (you might want to store this in a service)
  userEmail: string = '';

  ngOnInit(): void {
    this.initForm();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  getPasswordStrength(password: string): string {
    if (!password) return '';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return 'very-weak';
      case 2:
        return 'weak';
      case 3:
        return 'medium';
      case 4:
        return 'strong';
      case 5:
        return 'very-strong';
      default:
        return '';
    }
  }

  getPasswordStrengthText(strength: string): string {
    switch (strength) {
      case 'very-weak':
        return 'Very Weak';
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      case 'very-strong':
        return 'Very Strong';
      default:
        return '';
    }
  }

  getPasswordStrengthColor(strength: string): string {
    switch (strength) {
      case 'very-weak':
        return 'bg-red-500';
      case 'weak':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-blue-500';
      case 'very-strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  }

  submitForm(): void {
    if (this.resetPasswordForm.valid) {
      this.clearMessages();
      this.isLoading = true;
      this.subscription.unsubscribe();

      const formValues = this.resetPasswordForm.value;

      this.subscription = this.authService.resetPassword(formValues.email, formValues.newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.statusMsg === 'success') {
            this.toastrService.success('Password reset successfully!', 'NEXUS');

            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.msgError = error.error.message || 'An error occurred while resetting password. Please try again.';
        }
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
      this.msgError = 'Please fill in all fields correctly.';
    }
  }

  clearMessages(): void {
    this.msgError = null;
    this.msgSuccess = null;
  }

  goBack(): void {
    this.router.navigate(['/verify-code']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
