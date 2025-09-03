import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)

  private getHeaders(): object {
    const token = this.cookieService.get('token');
    return {
      headers: {
        token: token
      }
    };
  }

  addProductToCart(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'cart', { productId: productId }, this.getHeaders());
  }
  getCartProducts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'cart', this.getHeaders());
  }
  updateQuantity(id: string, quantity: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'cart/' + id, { count: quantity }, this.getHeaders());
  }
  removeCartItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'cart/' + id, this.getHeaders());
  }

}
