import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)


  addProductToWishlist(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'wishlist', { productId: productId });
  }
  getWishlistProducts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'wishlist');
  }
  removeWishlistItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'wishlist/' + id);
  }
}
