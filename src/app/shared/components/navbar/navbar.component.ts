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
import { MatDialog } from '@angular/material/dialog';
import { OutpopComponent } from './outpop/outpop.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly dialog = inject(MatDialog);

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

}
