import { Component, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { cart } from './models/cart.interface';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);


  cartList: cart = {} as cart;

  ngOnInit() {
    this.getLoggedInUser();
  }

  getLoggedInUser(): void {
    this.cartService.getCartProducts().subscribe({
      next: (response) => {

        this.cartList = response;
      },
      error: (error) => {
        console.error('Error fetching cart products');
      }
    });
  }
  updateQuantity(id: string, quantity: number): void {
    this.cartService.updateQuantity(id, quantity).subscribe({
      next: (response) => {
        this.cartList = response;
      },
      error: (error) => {
        console.error('Error updating cart item');
      }
    });
  }
  removeItem(id: string): void {
    this.cartService.removeItem(id).subscribe({
      next: (response) => {
        this.cartList = response;
        this.toastrService.error(`Product removed from cart!`, 'NEXUS');

      },
      error: (error) => {
        console.error('Error removing cart item');
      }
    });
  }

}
