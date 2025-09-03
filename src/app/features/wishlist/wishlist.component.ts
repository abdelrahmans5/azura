import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from './services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { cart } from '../cart/models/cart.interface';
import { Wishlist } from './models/wishlist.interface';
import { CartService } from '../cart/services/cart.service';
import { log } from 'node:console';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);

  wishList: Wishlist = {} as Wishlist;
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.getLoggedInUser();
  }

  getLoggedInUser(): void {
    this.isLoading = true;
    this.error = null;

    this.wishlistService.getWishlistProducts().subscribe({
      next: (response) => {
        this.wishList = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load wishlist. Please try again later.';
        this.isLoading = false;
        console.error('Error loading wishlist:', error);
      }
    });
  }

  removeWishlistItem(id: string): void {
    this.wishlistService.removeWishlistItem(id).subscribe({
      next: (response) => {
        this.wishList = response;
        this.getLoggedInUser();
        this.toastrService.info(`Product goes!`, 'NEXUS');
      },
      error: (error) => {
        this.toastrService.error('Failed to remove item from wishlist', 'NEXUS');
      }
    });
  }

  addToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: () => {
        this.removeWishlistItem(productId);
      },
    });
  }

  moveToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: () => {
        this.removeWishlistItem(productId);
      },
    });
  }

}
