import { Wishlist } from './../../../features/wishlist/models/wishlist.interface';
import { cart } from './../../../features/cart/models/cart.interface';
import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { CartComponent } from '../../../features/cart/cart.component';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  constructor(private flowbiteService: FlowbiteService) { }

  @Input({ required: true }) isLogin!: boolean;
  cartCount: number = 0;

  userData: any = this.authService.decodeToken();
  WishlistNumber: number = 0;
  isProfileDropdownOpen: boolean = false;

  ngOnInit(): void {
    if (this.isLogin) {
      this.cartCountData();
      this.wishlistCount();
    }
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  wishlistCount(): void {
    this.wishlistService.getWishlistProducts().subscribe({
      next: (response) => {
        this.WishlistNumber = response.count;
      }
    });
  }
  cartCountData() {
    if (!this.isLogin) {
      this.cartCount = 0;
      return;
    }

    this.cartService.getCartProducts().subscribe({
      next: (response) => {
        this.cartCount = response.numOfCartItems;
      },
      error: (error) => {
        console.error('Error loading cart count:', error);
        // Reset cart count on error (likely means user is not authenticated)
        this.cartCount = 0;
      }
    });
  }

  logOut(): void {
    this.authService.logout();
    this.closeProfileDropdown();
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

}
