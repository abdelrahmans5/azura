import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../features/cart/services/cart.service';
import { cart } from '../../../features/cart/models/cart.interface';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService)

  cartListData: cart = {} as cart;

  addProductToCart(productId: string) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        this.cartListData = response.data.products;
        this.toastrService.success(`${this.product.title} added to cart!`, 'NEXUS');

      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      }
    });
  }



  @Input({ required: true }) product: Product = {} as Product;



  addToWishlist(): void {
    // TODO: Implement wishlist service
    this.toastrService.success(`${this.product.title} added to wishlist!`, 'NEXUS');
  }

  quickView(product: Product): void {
    // TODO: Implement quick view modal
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

  onImageError(event: any): void {
    event.target.src = '/images/placeholder-product.jpg'; // Fallback image
  }
}

