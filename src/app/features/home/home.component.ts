import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  newArrivals = [
    { id: 1, name: 'Mini Jacket', price: '$59.99', image: 'images/mini-jacket-400x465.jpg' },
    { id: 2, name: 'Polo T-shirt', price: '$45.00', image: 'images/polo-tshirt-400x465.jpg' },
    { id: 3, name: 'Solid T-shirt', price: '$69.99', image: 'images/solid-shirt-blue-400x465.jpg' },
    { id: 4, name: 'Cream T-Shirt', price: '$25.00', image: 'images/cream-tshirt-400x465.jpg' }
  ];

  bestsellers = [
    { id: 1, name: 'Leather Handbag', price: '$120.00', image: 'images/funky-hoodie-400x465.jpg', tag: 'Best Seller' },
    { id: 2, name: 'Slim Fit Jeans', price: '$75.00', image: 'images/footer-img-04.jpg', tag: 'Hot' },
    { id: 3, name: 'Running Shoes', price: '$95.00', image: 'images/footer-img-02.jpg' },
    { id: 4, name: 'Wool Sweater', price: '$85.00', image: 'images/footer-img-03.jpg', tag: 'Limited' }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      quote: 'Absolutely love the quality and style! I get compliments every time I wear it.',
      avatar: 'images/testimonial-01.png'
    },
    {
      name: 'Ahmed Ali',
      location: 'Cairo, Egypt',
      quote: 'Fast shipping and amazing designs. Will definitely shop again!',
      avatar: 'images/testimonial-02.png'
    },
    {
      name: 'Laura Smith',
      location: 'London, UK',
      quote: 'Trendy clothes at great prices. My new go-to fashion store.',
      avatar: 'images/testimonial-03.png'
    }
  ];

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
