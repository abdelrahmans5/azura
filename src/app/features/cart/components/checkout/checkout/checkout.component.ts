import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../../../../core/services/checkOut/checkout.service';
import { CartService } from '../../../services/cart.service';
import { cart, Data } from '../../../models/cart.interface';

export type PaymentMethod = 'cash' | 'visa';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly cartService = inject(CartService);

  private subscriptions: Subscription[] = [];

  checkoutForm: FormGroup = this.fb.group({
    details: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+2|002)?01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]]
  });

  cartId: string = '';
  cartData: Data | null = null;
  selectedPaymentMethod: PaymentMethod = 'cash';
  isLoading: boolean = false;
  isProcessingPayment: boolean = false;

  ngOnInit(): void {
    this.cartId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.cartId) {
      this.toastr.error('Cart ID is required', 'Error');
      this.router.navigate(['/cart']);
      return;
    }
    this.loadCartData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCartData(): void {
    this.isLoading = true;
    const cartSub = this.cartService.getCartProducts().subscribe({
      next: (response: cart) => {
        if (response.status === 'success' && response.data) {
          this.cartData = response.data;
        } else {
          this.toastr.error('Failed to load cart data', 'Error');
          this.router.navigate(['/cart']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.toastr.error('Failed to load cart data', 'Error');
        this.router.navigate(['/cart']);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(cartSub);
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid Egyptian phone number';
        return `${fieldName} format is invalid`;
      }
    }
    return '';
  }

  proceedToPayment(): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      this.toastr.error('Please fill in all required shipping information', 'Validation Error');
      return;
    }

    const formValue = this.checkoutForm.value;
    this.isProcessingPayment = true;

    if (this.selectedPaymentMethod === 'cash') {
      this.processCashOrder(formValue);
    } else {
      this.processVisaOrder(formValue);
    }
  }

  private processCashOrder(formValue: any): void {
    const orderSub = this.checkoutService.createCashOrder(
      this.cartId,
      formValue.details,
      formValue.phone,
      formValue.city
    ).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.toastr.success('Cash order placed successfully!', 'Success');
          this.router.navigate(['/orders']);
        } else {
          this.toastr.error('Failed to place cash order', 'Error');
          this.router.navigate(['/cart']);
        }
        this.isProcessingPayment = false;
      },
      error: (error) => {
        console.error('Error placing cash order:', error);
        this.toastr.error('Failed to place cash order. Please try again.', 'Error');
        this.router.navigate(['/cart']);
        this.isProcessingPayment = false;
      }
    });
    this.subscriptions.push(orderSub);
  }

  private processVisaOrder(formValue: any): void {
    const orderSub = this.checkoutService.createVisaOrder(
      this.cartId,
      formValue.details,
      formValue.phone,
      formValue.city
    ).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.session && response.session.url) {
          this.toastr.success('Redirecting to Stripe payment...', 'Success');
          window.location.href = response.session.url;
        } else {
          this.toastr.error('Failed to create payment session', 'Error');
          this.router.navigate(['/cart']);
        }
        this.isProcessingPayment = false;
      },
      error: (error) => {
        console.error('Error placing visa order:', error);
        this.toastr.error('Failed to create visa payment. Please try again.', 'Error');
        this.router.navigate(['/cart']);
        this.isProcessingPayment = false;
      }
    });
    this.subscriptions.push(orderSub);
  }

  getTotalPrice(): number {
    return this.cartData?.totalCartPrice || 0;
  }

  getItemsCount(): number {
    return this.cartData?.products.length || 0;
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}
