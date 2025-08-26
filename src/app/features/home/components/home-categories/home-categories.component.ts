import { Component } from '@angular/core';

@Component({
  selector: 'app-home-categories',
  imports: [],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css'
})
export class HomeCategoriesComponent {
  categories = [
    {
      name: 'Men',
      image: 'images/category-01.jpg'
    },
    {
      name: 'Women',
      image: 'images/category-02.jpg'
    },
    {
      name: 'Kids',
      image: 'images/category-03.jpg'
    },
    {
      name: 'Accessories',
      image: 'images/category-04.jpg'
    },
    {
      name: 'Shoes',
      image: 'images/category-05.jpg'
    }
  ];
}
