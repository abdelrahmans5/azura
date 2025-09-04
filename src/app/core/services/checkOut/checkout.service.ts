import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderResponse {
  status: string;
  message?: string;
  data?: any;
  session?: {
    url: string;
    id: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private getHeaders(): object {
    const token = this.cookieService.get('token');
    return {
      headers: {
        token: token
      }
    };
  }

  createCashOrder(cartId: string, details: string, phone: string, city: string): Observable<OrderResponse> {
    const shippingAddress: ShippingAddress = {
      details,
      phone,
      city
    };

    return this.httpClient.post<OrderResponse>(
      `${environment.baseUrl}orders/${cartId}`,
      { shippingAddress },
      this.getHeaders()
    );
  }

  createVisaOrder(cartId: string, details: string, phone: string, city: string): Observable<OrderResponse> {
    const shippingAddress: ShippingAddress = {
      details,
      phone,
      city
    };
    return this.httpClient.post<OrderResponse>(
      `${environment.baseUrl}orders/checkout-session/${cartId}`,
      { shippingAddress },
      this.getHeaders()
    );
  }


  getUserOrders(): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}orders/user`,
      this.getHeaders()
    );
  }
}
