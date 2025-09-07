import { Component, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { cart } from './models/cart.interface';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);


  cartList: cart = {} as cart;

  ngOnInit() {
    this.getLoggedInUser();
  }

  getLoggedInUser(): void {
    // Check if user is authenticated before making cart API call
    const token = this.cookieService.get('token');
    if (!token) {
      this.toastrService.error('Please login to view your cart', 'NEXUS');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.getCartProducts().subscribe({
      next: (response) => {
        this.cartList = response;
      }
    });
  }
  updateQuantity(id: string, quantity: number): void {
    this.cartService.updateQuantity(id, quantity).subscribe({
      next: (response) => {
        this.cartList = response;
        this.toastrService.success('Quantity updated successfully', 'NEXUS');
      }
    });
  }
  removeCartItem(id: string): void {
    this.cartService.removeCartItem(id).subscribe({
      next: (response) => {
        this.cartList = response;
        this.toastrService.error(`Product removed from cart!`, 'NEXUS');
      }
    });
  }

  proceedToCheckout(): void {
    if (!this.cartList.cartId) {
      this.toastrService.error('Cart ID not found. Please refresh and try again', 'NEXUS');
      return;
    }

    if (this.cartList.numOfCartItems === 0) {
      this.toastrService.warning('Your cart is empty. Add items before checkout', 'NEXUS');
      return;
    }

    this.router.navigate(['/checkout', this.cartList.cartId]);
  }

}
