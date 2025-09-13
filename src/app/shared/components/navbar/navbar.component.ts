import { Wishlist } from './../../../features/wishlist/models/wishlist.interface';
import { cart } from './../../../features/cart/models/cart.interface';
import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { CartComponent } from '../../../features/cart/cart.component';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { OutpopComponent } from './outpop/outpop.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly dialog = inject(MatDialog);
  private readonly themeService = inject(ThemeService);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(OutpopComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  constructor(private flowbiteService: FlowbiteService) { }

  @Input({ required: true }) isLogin!: boolean;
  cartCount: number = 0;

  userData: any = this.authService.decodeToken();
  WishlistNumber: number = 0;
  isProfileDropdownOpen: boolean = false;
  isMobileMenuOpen: boolean = false;

  get userDisplayName(): string {
    return this.userData?.name || 'User';
  }

  get userDisplayEmail(): string {
    return this.userData?.email || 'user@azura.com';
  }

  // Theme-aware getters for styling
  get isLightMode(): boolean {
    return this.themeService.isLight();
  }

  get isDarkMode(): boolean {
    return this.themeService.isDark();
  }

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
      }
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  toggleMobileMenu(): void {
    console.log('Mobile menu toggle clicked, current state:', this.isMobileMenuOpen);
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('New mobile menu state:', this.isMobileMenuOpen);

    // Add body scroll lock when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    console.log('Closing mobile menu');
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Close mobile menu when clicking on a link
  onMobileMenuLinkClick(): void {
    console.log('Mobile menu link clicked, closing menu');
    this.closeMobileMenu();
  }
}
