import { Order } from './../../core/models/order.interface';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { CheckoutService } from '../../core/services/checkOut/checkout.service';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toastrService = inject(ToastrService);
  private readonly checkoutService = inject(CheckoutService);

  userData: any;
  userProfile: UserProfile = {
    name: '',
    email: '',
    phone: '',
    joinDate: ''
  };

  activeTab: string = 'personal';

  // Forms
  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;

  // Loading states
  isUpdatingProfile: boolean = false;
  isUpdatingPassword: boolean = false;

  // Error/Success messages
  profileError: string | null = null;
  profileSuccess: string | null = null;
  passwordError: string | null = null;
  passwordSuccess: string | null = null;

  Orders: Order[] = [];

  // Subscriptions
  private subscription = new Subscription();

  ngOnInit(): void {
    this.userData = this.authService.decodeToken();
    this.initializeForms();
    this.loadUserProfile();

    // Load user orders if user is authenticated
    if (this.userData && this.userData.id) {
      this.getOrders(this.userData.id);
    }
  }

  getOrders(id: string): void {
    this.checkoutService.getUserOrders(id).subscribe({
      next: (response) => {
        this.Orders = response;
      }
    });
  }

  initializeForms(): void {
    // Personal Info Form
    this.personalInfoForm = this.fb.group({
      name: [this.userData?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.userData?.email || '', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]]
    });

    // Password Form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  loadUserProfile(): void {
    if (this.userData) {
      this.userProfile = {
        name: this.userData.name || '',
        email: this.userData.email || '',
        phone: this.userData.phone || '',
        joinDate: this.formatJoinDate(this.userData.iat)
      };

      // Update form values
      this.personalInfoForm.patchValue({
        name: this.userProfile.name,
        email: this.userProfile.email,
        phone: this.userProfile.phone
      });
    }
  }

  formatJoinDate(timestamp: number): string {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  updateProfile(): void {
    if (this.personalInfoForm.valid) {
      this.clearProfileMessages();
      this.isUpdatingProfile = true;

      const formValues = this.personalInfoForm.value;

      this.subscription.add(
        this.authService.updateMe(formValues.name, formValues.email, formValues.phone).subscribe({
          next: (response) => {
            this.isUpdatingProfile = false;
            if (response.message === 'success' || response.status === 'success') {
              this.profileSuccess = 'Profile updated successfully!';
              this.toastrService.success('Profile updated successfully!', 'NEXUS');

              // Update local user data
              this.userProfile = {
                ...this.userProfile,
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone
              };
            }
          },
          error: (error) => {
            this.isUpdatingProfile = false;
            this.profileError = error.error.message || 'Failed to update profile. Please try again.';
            this.toastrService.error(this.profileError || 'Failed to update profile', 'NEXUS');
          }
        })
      );
    } else {
      this.personalInfoForm.markAllAsTouched();
      this.profileError = 'Please fill in all required fields correctly.';
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.clearPasswordMessages();
      this.isUpdatingPassword = true;

      const formValues = this.passwordForm.value;

      this.subscription.add(
        this.authService.changeMyPassword(formValues.currentPassword, formValues.newPassword).subscribe({
          next: (response) => {
            this.isUpdatingPassword = false;
            if (response.message === 'success' || response.status === 'success') {
              this.passwordSuccess = 'Password updated successfully!';
              this.toastrService.success('Password updated successfully!', 'NEXUS');
              this.passwordForm.reset();
            }
          },
          error: (error) => {
            this.isUpdatingPassword = false;
            this.passwordError = error.error.message || 'Failed to update password. Please try again.';
            this.toastrService.error(this.passwordError || 'Failed to update password', 'NEXUS');
          }
        })
      );
    } else {
      this.passwordForm.markAllAsTouched();
      this.passwordError = 'Please fill in all fields correctly.';
    }
  }

  clearProfileMessages(): void {
    this.profileError = null;
    this.profileSuccess = null;
  }

  clearPasswordMessages(): void {
    this.passwordError = null;
    this.passwordSuccess = null;
  }

  // Form validation helpers
  isFieldInvalid(formName: 'personal' | 'password', fieldName: string): boolean {
    const form = formName === 'personal' ? this.personalInfoForm : this.passwordForm;
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(formName: 'personal' | 'password', fieldName: string): string {
    const form = formName === 'personal' ? this.personalInfoForm : this.passwordForm;
    const field = form.get(fieldName);

    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid phone number';
        if (fieldName === 'newPassword') return 'Password must include uppercase, lowercase, number, and special character';
      }
    }

    return '';
  }

  isPasswordMismatch(): boolean {
    return !!(this.passwordForm.hasError('passwordMismatch') &&
      this.passwordForm.get('confirmPassword')?.touched);
  }
}
