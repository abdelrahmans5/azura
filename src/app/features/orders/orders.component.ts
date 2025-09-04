import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../core/services/checkOut/checkout.service';
import { Order, OrdersResponse } from '../../core/models/order.interface';

@Component({
    selector: 'app-orders',
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, OnDestroy {
    private readonly checkoutService = inject(CheckoutService);
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);

    orders: Order[] = [];
    isLoading: boolean = false;
    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadOrders();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    loadOrders(): void {
        this.isLoading = true;
        const ordersSub = this.checkoutService.getUserOrders().subscribe({
            next: (response: OrdersResponse) => {
                if (response.status === 'success') {
                    this.orders = response.data || [];
                } else {
                    this.toastr.error('Failed to load orders', 'Error');
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading orders:', error);
                this.toastr.error('Failed to load orders. Please try again.', 'Error');
                this.isLoading = false;
            }
        });
        this.subscriptions.push(ordersSub);
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-500';
            case 'shipped':
                return 'bg-blue-500';
            case 'processing':
                return 'bg-yellow-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    navigateToProducts(): void {
        this.router.navigate(['/products']);
    }
}
