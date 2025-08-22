import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { DetailsComponent } from './features/details/details.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { BrandsComponent } from './features/brands/brands.component';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '', component: AuthLayoutComponent, children: [
            { path: 'login', component: LoginComponent, title: 'Login' },
            { path: 'register', component: RegisterComponent, title: 'Register' }
        ]
    },
    {
        path: '', component: BlankLayoutComponent, children: [
            { path: 'home', component: HomeComponent, title: 'Home' },
            { path: 'products', component: ProductsComponent, title: 'Products' },
            { path: 'brands', component: BrandsComponent, title: 'Brands' },
            { path: 'cart', component: CartComponent, title: 'Cart' },
            { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
            { path: 'details/:id', component: DetailsComponent, title: 'Details' },
            { path: 'details/:slug/:id', component: DetailsComponent, title: 'Details' },
            { path: 'categories', component: CategoriesComponent, title: 'Categories' },
            { path: 'about', component: AboutComponent, title: 'About' }
        ]
    },
    { path: '**', component: NotFoundComponent, title: 'Not Found' }
];
