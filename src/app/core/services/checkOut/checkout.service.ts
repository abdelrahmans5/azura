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


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);



  createCashOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.baseUrl}orders/${cartId}`,
      shippingAddress
    );
  }

  createVisaOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this.httpClient.post<any>(environment.baseUrl + `orders/checkout-session/${cartId}?url=http://localhost:4200`,
      shippingAddress
    );
  }


  getUserOrders(id: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `orders/user/${id}`);
  }
}
