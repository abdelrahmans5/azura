import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  private readonly router = inject(Router);


  @Input({ required: true }) product: Product = {} as Product;

  // Product interaction methods
  addToCart(product: Product): void {
    // TODO: Implement cart service
    alert(`${product.title} added to cart!`);
  }

  addToWishlist(product: Product): void {
    // TODO: Implement wishlist service
    alert(`${product.title} added to wishlist!`);
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

