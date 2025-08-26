import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../core/models/categories.interface';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService);

  categoriesList: Category[] = [];

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categoriesList = response.data;
      },
      error: (error) => {
        // Handle error silently or show user-friendly message
      }
    });
  }
}
