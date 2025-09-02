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

  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  }

  addProductToCart(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'cart', { productId: productId }, this.myHeaders);
  }
  getCartProducts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'cart', this.myHeaders);
  }
  updateQuantity(id: string, quantity: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'cart/' + id, { count: quantity }, this.myHeaders);
  }
  removeItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'cart/' + id, this.myHeaders);
  }

}
