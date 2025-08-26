import { Product } from './../../core/models/product.interface';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from './services/details.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly detailsService = inject(DetailsService)
  private subscriptions: Subscription[] = [];

  productDetails: Product = {} as Product;
  id: string | null = null;

  ngOnInit(): void {
    this.getProductId();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getProductId() {
    const sub = this.activatedRoute.paramMap.subscribe(
      {
        next: (params) => {
          this.id = params.get('id');
          if (this.id) {
            this.getProductDetails();
          }
        }
      }
    );
    this.subscriptions.push(sub);
  }

  getProductDetails(): void {
    if (!this.id) {
      return;
    }

    const sub = this.detailsService.getProductById(this.id).subscribe(
      {
        next: (product) => {
          this.productDetails = product.data;
        }
      }
    );
    this.subscriptions.push(sub);
  }
}
