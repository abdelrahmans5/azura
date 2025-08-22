import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private readonly productsService = inject(ProductsService);

  // Data properties
  productsList: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  uniqueCategories: string[] = [];

  // UI State properties
  isLoading = false;
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  selectedCategory = 'all';
  sortBy = '';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 0;

  ngOnInit(): void {
    this.getAllProductsData();
  }

  getAllProductsData(): void {
    this.isLoading = true;
    this.error = null;

    this.productsService.getAllProducts().subscribe({
      next: (response) => {
        this.productsList = response.data;
        this.filteredProducts = [...this.productsList];
        this.extractUniqueCategories();
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
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
    this.updatePagination();
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
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.sortBy = '';
    this.filteredProducts = [...this.productsList];
    this.currentPage = 1;
    this.updatePagination();
  }

}
