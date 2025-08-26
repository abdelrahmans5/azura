import { Component } from '@angular/core';
import { NewArrivalsComponent } from "./components/new-arrivals/new-arrivals.component";
import { CategoriesComponent } from "../categories/categories.component";
import { BestSellersComponent } from "./components/best-sellers/best-sellers.component";
import { PromoComponent } from "./components/promo/promo.component";
import { FeaturesComponent } from "./components/features/features.component";
import { HeroComponent } from "./components/hero/hero.component";
import { HomeCategoriesComponent } from "./components/home-categories/home-categories.component";

@Component({
  selector: 'app-home',
  imports: [NewArrivalsComponent, BestSellersComponent, PromoComponent, FeaturesComponent, HeroComponent, HomeCategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {








}
