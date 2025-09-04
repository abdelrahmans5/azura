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
      },
      error: (error) => {
        console.error('Error fetching cart products:', error);

        // If it's a 401 error, redirect to login
        if (error.status === 401) {
          this.toastrService.error('Session expired. Please login again', 'NEXUS');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Error loading cart. Please try again', 'NEXUS');
        }
      }
    });
  }
  updateQuantity(id: string, quantity: number): void {
    this.cartService.updateQuantity(id, quantity).subscribe({
      next: (response) => {
        this.cartList = response;
        this.toastrService.success('Quantity updated successfully', 'NEXUS');
      },
      error: (error) => {
        console.error('Error updating cart item:', error);

        if (error.status === 401) {
          this.toastrService.error('Session expired. Please login again', 'NEXUS');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Error updating quantity. Please try again', 'NEXUS');
        }
      }
    });
  }
  removeCartItem(id: string): void {
    this.cartService.removeCartItem(id).subscribe({
      next: (response) => {
        this.cartList = response;
        this.toastrService.error(`Product removed from cart!`, 'NEXUS');
      },
      error: (error) => {
        console.error('Error removing cart item:', error);

        if (error.status === 401) {
          this.toastrService.error('Session expired. Please login again', 'NEXUS');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Error removing item. Please try again', 'NEXUS');
        }
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

    // Navigate to checkout with cart ID
    this.router.navigate(['/checkout', this.cartList.cartId]);
  }

}
