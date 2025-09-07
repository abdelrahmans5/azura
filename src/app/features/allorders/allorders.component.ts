import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../core/services/checkOut/checkout.service';
import { Allorders } from './models/allorders.interface';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
    selector: 'app-allorders',
    imports: [CommonModule],
    templateUrl: './allorders.component.html',
    styleUrl: './allorders.component.css'
})
export class AllordersComponent {
    private readonly checkoutService = inject(CheckoutService);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    orders: Allorders[] = [];
    userId!: string;
    userData: any = null;


    ngOnInit(): void {
        this.userData = this.authService.decodeToken();
        if (this.userData && this.userData.id) {
            this.userId = this.userData.id;
            this.loadOrders(this.userId);
        } else {
            this.router.navigate(['/login']);
        }
    }

    loadOrders(id: string): void {
        this.checkoutService.getUserOrders(id).subscribe({
            next: (response) => {
                this.orders = response;

            }
        });
    }

    goBack(): void {
        this.router.navigate(['/products']);
    }

    navigateToProducts(): void {
        this.router.navigate(['/products']);
    }
}
