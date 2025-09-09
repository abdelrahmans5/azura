import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);

    // Signal to manage theme state
    private readonly _theme = signal<Theme>('dark');

    // Public readonly signal
    readonly theme = this._theme.asReadonly();

    constructor() {
        // Initialize theme from localStorage or system preference
        this.initializeTheme();

        // Effect to update DOM and localStorage when theme changes
        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                const currentTheme = this._theme();
                this.updateDOM(currentTheme);
                this.saveToStorage(currentTheme);
            }
        });
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme(): void {
        this._theme.update(current => current === 'dark' ? 'light' : 'dark');
    }

    /**
     * Set specific theme
     */
    setTheme(theme: Theme): void {
        this._theme.set(theme);
    }

    /**
     * Check if current theme is dark
     */
    isDark(): boolean {
        return this._theme() === 'dark';
    }

    /**
     * Check if current theme is light
     */
    isLight(): boolean {
        return this._theme() === 'light';
    }

    /**
     * Initialize theme from storage or system preference
     */
    private initializeTheme(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const storedTheme = localStorage.getItem('azura-theme') as Theme;

        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
            this._theme.set(storedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this._theme.set(prefersDark ? 'dark' : 'light');
        }
    }

    /**
     * Update DOM with theme classes
     */
    private updateDOM(theme: Theme): void {
        const htmlElement = document.documentElement;

        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            htmlElement.classList.remove('light');
        } else {
            htmlElement.classList.add('light');
            htmlElement.classList.remove('dark');
        }
    }

    /**
     * Save theme preference to localStorage
     */
    private saveToStorage(theme: Theme): void {
        localStorage.setItem('azura-theme', theme);
    }
}
