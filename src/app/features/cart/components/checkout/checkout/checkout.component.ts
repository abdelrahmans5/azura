import { ShippingAddress } from './../../../../../core/models/order.interface';
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
    ShippingAddress: this.fb.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+2|002)?01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]]
    })
  });

  cartId: string = '';
  cartData: Data | null = null;
  selectedPaymentMethod: PaymentMethod = 'cash';
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
    const cartSub = this.cartService.getCartProducts().subscribe({
      next: (response: cart) => {
        if (response.status === 'success' && response.data) {
          this.cartData = response.data;
        } else {
          this.toastr.error('Failed to load cart data', 'Error');
          this.router.navigate(['/cart']);
        }
      }
    });
    this.subscriptions.push(cartSub);
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(`ShippingAddress.${fieldName}`);
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
      this.checkoutForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields correctly', 'Error');
      return;
    }

    const shippingAddress = this.checkoutForm.get('ShippingAddress')?.value;
    this.isProcessingPayment = true;

    if (this.selectedPaymentMethod === 'cash') {
      this.processCashOrder(this.cartId, shippingAddress);
    } else {
      this.processVisaOrder(this.cartId, shippingAddress);
    }
  }

  private processCashOrder(cartId: string, shippingAddress: object): void {
    this.checkoutService.createCashOrder(
      cartId,
      shippingAddress
    ).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.toastr.success('Cash order placed successfully!', 'Success');
          this.router.navigate(['/allorders']);
        } else {
          this.toastr.error('Failed to place cash order', 'Error');
          this.router.navigate(['/cart']);
        }
        this.isProcessingPayment = false;
      }
    });
  }

  private processVisaOrder(cartId: string, shippingAddress: object): void {
    const orderSub = this.checkoutService.createVisaOrder(cartId, shippingAddress).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.session && response.session.url) {
          this.toastr.success('Redirecting to Stripe payment...', 'Success');
          window.location.href = response.session.url;
        } else {
          this.toastr.error('Failed to create payment session', 'Error');
          this.router.navigate(['/cart']);
        }
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
