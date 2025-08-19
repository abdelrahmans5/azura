import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/models/product.interface';
import { log } from 'console';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private readonly productsService = inject(ProductsService)

  productsList: Product[] = [];

  ngOnInit(): void {
    this.getAllProductsData();

  }
  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe(
      {
        next: (products) => {
          this.productsList = products.data;

        },
        error: (error) => {
          console.error(error);
        }
      }
    )
  }
}
