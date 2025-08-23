# NEXUS E-Commerce - AI Agent Instructions

## Architecture Overview

This is an Angular 20+ SSR-enabled e-commerce application with a futuristic design theme. The app uses standalone components with modern Angular patterns.

### Core Structure
- **Layout System**: Dual layout approach - `AuthLayoutComponent` for login/register, `BlankLayoutComponent` for main app
- **Feature Modules**: Organized in `src/app/features/` with dedicated components for each major section
- **Shared Components**: Reusable UI components in `src/app/shared/components/`
- **Core Services**: Business logic and API integration in `src/app/core/services/`

## Key Patterns & Conventions

### Component Architecture
- **Standalone Components**: All components use `imports: []` instead of NgModules
- **Injection Pattern**: Use `private readonly service = inject(ServiceName)` for dependency injection
- **Input Validation**: Required inputs use `@Input({ required: true })`

Example component structure:
```typescript
@Component({
  selector: 'app-example',
  imports: [CommonModule, RouterLink],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  private readonly router = inject(Router);
  @Input({ required: true }) data: Product = {} as Product;
}
```

### Styling & Design System
- **Framework**: TailwindCSS 4.x with custom futuristic theme
- **Design Language**: Cyber/tech aesthetic with gradients (`from-cyan-400 to-purple-600`)
- **Component Library**: Flowbite integration via `FlowbiteService` for SSR-safe loading
- **Icons**: FontAwesome (`@fortawesome/fontawesome-free`)
- **Animations**: Swiper.js for carousels, CSS transitions for interactions

### Data Layer
- **API Integration**: External API at `https://ecommerce.routemisr.com/api/v1/`
- **HTTP Client**: Uses `provideHttpClient(withFetch())` for modern fetch API
- **Interfaces**: Strongly typed with `Product` and `Category` interfaces in `core/models/`
- **State Management**: Service-based state (no external state library)

## Development Workflows

### Build & Development
```bash
ng serve          # Development server (localhost:4200)
ng build          # Production build with SSR
npm run serve:ssr:e-commerce  # Serve SSR build
```

### Component Generation
- Use Angular CLI: `ng generate component features/component-name`
- Follow existing folder structure in `features/` or `shared/components/`
- Add to appropriate layout's routing in `app.routes.ts`

### SSR Considerations
- **Platform Checks**: Use `isPlatformBrowser(this.platformId)` for browser-only code
- **Flowbite Loading**: Always use `FlowbiteService.loadFlowbite()` for dynamic imports
- **Image Handling**: Assets in `public/` folder, use absolute paths `/images/`

## Integration Points

### External Dependencies
- **Flowbite**: UI components loaded dynamically for SSR compatibility
- **TailwindCSS**: Utility-first styling with custom gradients and animations
- **FontAwesome**: Icon system throughout the application
- **Swiper**: Carousel components for product displays

### API Communication
- **Base URL**: Configured in `environment.development.ts`
- **Service Pattern**: Each feature has dedicated service (`ProductsService`, `CategoriesService`)
- **Response Types**: API returns `{ data: Product[] }` structure

### Routing & Navigation
- **Nested Routes**: Auth routes under `AuthLayoutComponent`, main routes under `BlankLayoutComponent`
- **Route Guards**: Directory structure suggests guards in `core/guards/` (implement as needed)
- **Dynamic Routes**: Product details use `/details/:id` and `/details/:slug/:id` patterns

## Component Interaction Patterns

### Product Card Component
- **Props**: Requires `product: Product` input
- **Events**: `addToCart()`, `addToWishlist()`, `quickView()` methods (TODO: implement services)
- **Navigation**: Uses `router.navigate()` for product details
- **Error Handling**: Image fallback to `/images/placeholder-product.jpg`

### Navbar Component
- **State Management**: Uses `isLogin` boolean for conditional rendering
- **Authentication Flow**: Login/Register buttons vs Cart/Logout buttons
- **Mobile Responsive**: Complex mobile menu with overlay and slide-in panel

## Project-Specific Conventions

### File Organization
- **Feature Components**: Group related components in `features/[feature]/components/`
- **Service Location**: Business logic services in `core/services/[domain]/`
- **Shared Resources**: Reusable components, directives, pipes in `shared/`

### Naming Conventions
- **Components**: PascalCase with `.component.ts` suffix
- **Services**: PascalCase with `.service.ts` suffix
- **Interfaces**: PascalCase in `core/models/` directory

### Error Handling
- **Image Errors**: Use `onImageError()` method with fallback images
- **HTTP Errors**: Handle in services, display user-friendly messages
- **Form Validation**: Use Angular reactive forms with custom validators

## Development Notes

- **Node Version**: Requires Node.js compatible with Angular 20+
- **Build Status**: Production-ready build (noted in README as of 2025-08-22)
- **Vercel Deployment**: Configured for Vercel hosting (empty `vercel.json`)
- **Testing**: Karma/Jasmine setup for unit tests (`ng test`)
