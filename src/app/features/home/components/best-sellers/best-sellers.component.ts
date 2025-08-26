import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../../core/services/products/products.service';
import { Product } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-best-sellers',
  imports: [],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.css'
})
export class BestSellersComponent {

  private readonly productsService = inject(ProductsService)

  bestsellers: Product[] = [];

  ngOnInit() {
    this.getBestSellers();
  }

  getBestSellers() {
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        // Sort products by 'sold' property in descending order and select the top ones
        this.bestsellers = products.data.sort((a: Product, b: Product) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 4);
      }
    });
  }
}

