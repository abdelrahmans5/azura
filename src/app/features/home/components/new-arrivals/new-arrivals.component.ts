import { Product } from './../../../../core/models/product.interface';
import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductsService } from '../../../../core/services/products/products.service';
import { CartService } from '../../../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-arrivals',
  imports: [],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewArrivalsComponent implements OnInit {
  private readonly productsService = inject(ProductsService)
  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)

  productsList: Product[] = [];

  addProductToCart(productId: string) {
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        this.toastrService.success(`${this.productsList[0].title} added to cart!`, 'AZURA');

      }
    });
  }

  ngOnInit() {
    this.getArrivals();
  }

  getArrivals() {
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.productsList = products.data.filter((product: Product) =>
          new Date(product.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
      }
    });
  }
}
