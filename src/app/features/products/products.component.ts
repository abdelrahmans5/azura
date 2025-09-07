import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from "../../shared/components/card/card.component";
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, CardComponent, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private readonly productsService = inject(ProductsService);

  // Data properties
  productsList: Product[] = [];
  filteredProducts: Product[] = [];
  uniqueCategories: string[] = [];

  // UI State properties
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  selectedCategory = 'all';
  sortBy = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 12;

  ngOnInit(): void {
    this.getAllProductsData();
  }

  getAllProductsData(): void {
    this.error = null;

    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        this.productsList = response.data;
        this.filteredProducts = [...this.productsList];
        this.extractUniqueCategories();
      }
    });
  }

  private extractUniqueCategories(): void {
    const categories = this.productsList.map(product => product.category.name);
    this.uniqueCategories = [...new Set(categories)];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === 'all') {
      this.filteredProducts = [...this.productsList];
    } else {
      this.filteredProducts = this.productsList.filter(
        product => product.category.name === category
      );
    }

    this.currentPage = 1;
  }

  sortProducts(): void {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.sortBy = '';
    this.filteredProducts = [...this.productsList];
    this.currentPage = 1;
  }

}
