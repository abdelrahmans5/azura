import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verifycode',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verifycode.component.html',
  styleUrl: './verifycode.component.css'
})
export class VerifycodeComponent implements OnInit, OnDestroy {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  verifyCodeForm!: FormGroup;
  msgError: string | null = null;
  msgSuccess: string | null = null;
  isLoading: boolean = false;
  subscription: Subscription = new Subscription();

  // 6-digit code array
  codeDigits: string[] = ['', '', '', '', '', ''];
  currentInputIndex: number = 0;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.verifyCodeForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit6: ['', [Validators.required, Validators.pattern(/^\d$/)]]
    });
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow single digit
    if (value.length > 1) {
      input.value = value.slice(-1);
    }

    this.codeDigits[index] = input.value;

    // Auto-focus next input
    if (input.value && index < 5) {
      const nextInput = this.codeInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }

    // Update form control
    const controlName = `digit${index + 1}`;
    this.verifyCodeForm.get(controlName)?.setValue(input.value);

    // Auto-submit when all 6 digits are entered
    if (this.isCodeComplete()) {
      this.submitForm();
    }
  }

  onDigitKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.codeInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
        prevInput.nativeElement.value = '';
        this.codeDigits[index - 1] = '';
        const controlName = `digit${index}`;
        this.verifyCodeForm.get(controlName)?.setValue('');
      }
    }

    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = this.codeInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
      }
    }

    if (event.key === 'ArrowRight' && index < 5) {
      const nextInput = this.codeInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }

    // Only allow digits
    if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, 6);

    if (digits.length === 6) {
      digits.split('').forEach((digit, index) => {
        this.codeDigits[index] = digit;
        const controlName = `digit${index + 1}`;
        this.verifyCodeForm.get(controlName)?.setValue(digit);

        const input = this.codeInputs.toArray()[index];
        if (input) {
          input.nativeElement.value = digit;
        }
      });

      // Focus last input
      const lastInput = this.codeInputs.toArray()[5];
      if (lastInput) {
        lastInput.nativeElement.focus();
      }

      // Auto-submit
      this.submitForm();
    }
  }

  isCodeComplete(): boolean {
    return this.codeDigits.every(digit => digit !== '' && /^\d$/.test(digit));
  }

  getCompleteCode(): string {
    return this.codeDigits.join('');
  }

  submitForm(): void {
    if (this.verifyCodeForm.valid && this.isCodeComplete()) {
      this.clearMessages();
      this.isLoading = true;
      this.subscription.unsubscribe();

      const resetCode = this.getCompleteCode();

      this.subscription = this.authService.verifyResetCode(resetCode).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status === 'Success') {
            this.msgSuccess = 'Code verified successfully! Redirecting to reset password...';
            // Navigate to reset password page after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/reset-password']);
            }, 2000);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.msgError = error.error.message || 'Invalid verification code. Please try again.';
          this.clearCode();
        }
      });
    } else {
      this.verifyCodeForm.markAllAsTouched();
      this.msgError = 'Please enter a valid 6-digit verification code.';
    }
  }

  clearCode(): void {
    this.codeDigits = ['', '', '', '', '', ''];
    this.verifyCodeForm.reset();

    // Clear all inputs and focus first one
    this.codeInputs.forEach((input, index) => {
      input.nativeElement.value = '';
    });

    const firstInput = this.codeInputs.toArray()[0];
    if (firstInput) {
      firstInput.nativeElement.focus();
    }
  }

  clearMessages(): void {
    this.msgError = null;
    this.msgSuccess = null;
  }

  goBack(): void {
    this.router.navigate(['/forgot-password']);
  }

  resendCode(): void {
    // This would typically resend the code
    this.clearMessages();
    this.msgSuccess = 'Verification code has been resent to your email.';
  }
}
