import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { group } from 'console';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)

  ngOnInit(): void {
    this.initForm();
  }


  msgError: string | null = null;
  isLoading: boolean = false;
  eyeFlag: boolean = true;
  registerForm!: FormGroup;

  initForm() {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)]],
      rePassword: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^(01)[0-9]{9}$/)]],
    }, { validators: this.passwordMatchValidator });
  }


  passwordMatchValidator(control: AbstractControl) {
    if (!control.get('password') || !control.get('rePassword')) {
      return null;
    }else{
      control.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
  }

  submitForm(): void {
    if (this.registerForm.valid) {

      this.isLoading = true;
      this.authService.registerForm(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.message === 'success') {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);

          }
          this.isLoading = false;
        },
        error: (error) => {
          this.msgError = error.error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.msgError = 'Form is invalid';
    }
  }
}
