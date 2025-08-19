import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient)

  getAllProducts(): Observable<any> {
    return this.httpClient.get('https://ecommerce.routemisr.com/api/v1/products');
  }

}
