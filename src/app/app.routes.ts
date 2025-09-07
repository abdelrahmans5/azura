import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { ForgetpassComponent } from './core/auth/login/forgotpasswords/forgetpass/forgetpass.component';
import { VerifycodeComponent } from './core/auth/login/verifycode/verifycode/verifycode.component';
import { ResetpassComponent } from './core/auth/login/resetpass/resetpass/resetpass.component';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/cart/components/checkout/checkout/checkout.component';
import { DetailsComponent } from './features/details/details.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { BrandsComponent } from './features/brands/brands.component';
import { AboutComponent } from './features/about/about.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './core/guards/auth-guard';
import { isLoggedGuard } from './core/guards/is-logged-guard';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { AllordersComponent } from './features/allorders/allorders.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '', component: AuthLayoutComponent, canActivate: [isLoggedGuard], children: [
            { path: 'login', component: LoginComponent, title: 'Login' },
            { path: 'register', component: RegisterComponent, title: 'Register' },
            { path: 'forgot-password', component: ForgetpassComponent, title: 'Forgot Password' },
            { path: 'verify-code', component: VerifycodeComponent, title: 'Verify Code' },
            { path: 'reset-password', component: ResetpassComponent, title: 'Reset Password' }
        ]
    },
    {
        path: '', component: BlankLayoutComponent, canActivate: [authGuard], children: [
            { path: 'home', component: HomeComponent, title: 'Home' },
            { path: 'products', component: ProductsComponent, title: 'Products' },
            { path: 'brands', component: BrandsComponent, title: 'Brands' },
            { path: 'cart', component: CartComponent, title: 'Cart' },
            { path: 'checkout/:id', component: CheckoutComponent, title: 'Checkout' },
            { path: 'allorders', component: AllordersComponent, title: 'All Orders' },
            { path: 'profile', component: ProfileComponent, title: 'Profile' },
            { path: 'details/:id', component: DetailsComponent, title: 'Details' },
            { path: 'details/:slug/:id', component: DetailsComponent, title: 'Details' },
            { path: 'categories', component: CategoriesComponent, title: 'Categories' },
            { path: 'about', component: AboutComponent, title: 'About' },
            { path: 'wishlist', component: WishlistComponent, title: 'Wishlist' }
        ]
    },
    { path: '**', component: NotFoundComponent, title: 'Not Found' }
];
