import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
    template: `
    <button 
      mat-icon-button
      (click)="toggleTheme()"
      [matTooltip]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      class="theme-toggle-btn group relative overflow-hidden">
      
      <!-- Background glow effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      
      <!-- Icon container -->
      <div class="relative z-10 transition-transform duration-300 group-hover:scale-110">
        @if (themeService.isDark()) {
          <mat-icon class="text-yellow-400">light_mode</mat-icon>
        } @else {
          <mat-icon class="text-slate-700">dark_mode</mat-icon>
        }
      </div>
      
      <!-- Rotating border -->
      <div class="absolute inset-0 border border-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500"></div>
    </button>
  `,
    styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
    readonly themeService = inject(ThemeService);

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
