import { Product } from './../../core/models/product.interface';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from './services/details.service';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../wishlist/services/wishlist.service';
import { Wishlist } from '../wishlist/models/wishlist.interface';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly detailsService = inject(DetailsService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly toastrService = inject(ToastrService)
  protected readonly themeService = inject(ThemeService)
  private subscriptions: Subscription[] = [];

  productDetails: Product = {} as Product;
  id: string | null = null;
  wishListData: Wishlist = {} as Wishlist;
  selectedImage: string = '';
  isHoveringThumbnail: boolean = false;

  ngOnInit(): void {
    this.getProductId();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addToCart(productId: string, productTitle: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        this.toastrService.success(`${productTitle} added to cart!`, 'AZURA');
      }
    });
  }
  addToWishlist(productId: string, productTitle: string): void {
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (response) => {
        this.toastrService.info(`${productTitle} added to wishlist!`, 'AZURA');
      }
    });
  }
  isInWishlist(): boolean {
    // Check if the product is in the wishlist
    return this.wishListData.data?.some(item => item.id === this.productDetails.id) || false;
  }

  onThumbnailHover(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.isHoveringThumbnail = true;
  }

  onThumbnailLeave(): void {
    this.isHoveringThumbnail = false;
    this.selectedImage = '';
  }

  getCurrentMainImage(): string {
    return this.isHoveringThumbnail && this.selectedImage
      ? this.selectedImage
      : this.productDetails.imageCover;
  }

  getProductId() {
    const sub = this.activatedRoute.paramMap.subscribe(
      {
        next: (params) => {
          this.id = params.get('id');
          if (this.id) {
            this.getProductDetails();
          }
        }
      }
    );
    this.subscriptions.push(sub);
  }

  getProductDetails(): void {
    if (!this.id) {
      return;
    }

    const sub = this.detailsService.getProductById(this.id).subscribe(
      {
        next: (product) => {
          this.productDetails = product.data;
        }
      }
    );
    this.subscriptions.push(sub);
  }
}
