import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)

  myHeaders: object = {
    headers: {
      token: this.cookieService.get('token')
    }
  }

  addProductToWishlist(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'wishlist', { productId: productId }, this.myHeaders);
  }
  getWishlistProducts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'wishlist', this.myHeaders);
  }
  removeWishlistItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'wishlist/' + id, this.myHeaders);
  }
}
