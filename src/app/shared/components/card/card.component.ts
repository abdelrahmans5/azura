import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.interface';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../features/cart/services/cart.service';
import { cart } from '../../../features/cart/models/cart.interface';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { Wishlist } from '../../../features/wishlist/models/wishlist.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly cookieService = inject(CookieService)

  cartListData: cart = {} as cart;
  wishListData: Wishlist = {} as Wishlist;

  @Input({ required: true }) product: Product = {} as Product;

  ngOnInit(): void {
    // Only load wishlist if user is authenticated
    if (this.isAuthenticated()) {
      this.loadWishlist();
    }
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('token');
  }

  loadWishlist(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.wishlistService.getWishlistProducts().subscribe({
      next: (response) => {
        this.wishListData = response;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        // Don't show error toast for wishlist loading failure when not authenticated
        if (error.status !== 401) {
          this.toastrService.error('Error loading wishlist', 'NEXUS');
        }
      }
    });
  }

  isInWishList(): boolean {
    if (!this.isAuthenticated() || !this.wishListData?.data) {
      return false;
    }
    return this.wishListData.data.some(item => item.id === this.product.id);
  }

  addProductToCart(productId: string) {
    if (!this.isAuthenticated()) {
      this.toastrService.warning('Please login to add items to cart', 'NEXUS');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        this.cartListData = response.data.products;
        this.toastrService.success(`${this.product.title} added to cart!`, 'NEXUS');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);

        if (error.status === 401) {
          this.toastrService.error('Session expired. Please login again', 'NEXUS');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Error adding product to cart', 'NEXUS');
        }
      }
    });
  }

  addProductToWishlist(productId: string) {
    if (!this.isAuthenticated()) {
      this.toastrService.warning('Please login to add items to wishlist', 'NEXUS');
      this.router.navigate(['/login']);
      return;
    }

    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (response) => {
        this.loadWishlist();
        this.toastrService.info(`${this.product.title} added to wishlist!`, 'NEXUS');
      },
      error: (error) => {
        console.error('Error adding product to wishlist:', error);

        if (error.status === 401) {
          this.toastrService.error('Session expired. Please login again', 'NEXUS');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Error adding product to wishlist', 'NEXUS');
        }
      }
    });
  }

  removeProductFromWishlist(productId: string) {
    if (!this.isAuthenticated()) {
      this.toastrService.warning('Please login to manage wishlist', 'NEXUS');
      this.router.navigate(['/login']);
      return;
    }

    this.wishlistService.removeWishlistItem(productId).subscribe({
      next: (response) => {
        this.loadWishlist(); // Reload wishlist to update UI
        this.toastrService.info(`${this.product.title} removed from wishlist!`, 'NEXUS');
      },
      error: (error) => {
        console.error('Error removing product from wishlist:', error);

        if (error.status === 401) {
          this.toastrService.error('Session expired. Please login again', 'NEXUS');
          this.router.navigate(['/login']);
        } else {
          this.toastrService.error('Error removing product from wishlist', 'NEXUS');
        }
      }
    });
  }

  toggleWishlist(productId: string) {
    if (!this.isAuthenticated()) {
      this.toastrService.warning('Please login to manage wishlist', 'NEXUS');
      this.router.navigate(['/login']);
      return;
    }

    if (this.isInWishList()) {
      this.removeProductFromWishlist(productId);
    } else {
      this.addProductToWishlist(productId);
    }
  }


  goToProductDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  // Utility methods
  isNewProduct(createdAt: string): boolean {
    const productDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate > thirtyDaysAgo;
  }
}

