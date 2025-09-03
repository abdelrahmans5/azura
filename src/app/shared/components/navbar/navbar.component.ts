import { cart } from './../../../features/cart/models/cart.interface';
import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { CartComponent } from '../../../features/cart/cart.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnChanges {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  constructor(private flowbiteService: FlowbiteService) { }

  @Input({ required: true }) isLogin!: boolean;
  cartCount: number = 0;

  userData: any = this.authService.decodeToken();
  // Profile dropdown state
  isProfileDropdownOpen: boolean = false;

  ngOnInit(): void {
    // Only load cart data if user is logged in
    if (this.isLogin) {
      this.cartCountData();
    }
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  ngOnChanges(): void {
    // Refresh cart data when login status changes
    if (this.isLogin) {
      this.cartCountData();
    } else {
      this.cartCount = 0;
    }
  }
  cartCountData() {
    // Double check login status before making API call
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
