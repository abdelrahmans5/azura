import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { NgxSpinnerComponent } from "ngx-spinner";
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, CarouselModule, CommonModule, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'azura';

  // Initialize theme service
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    // Theme service will automatically initialize from localStorage or system preference
    // No additional setup needed here as it's handled in the service constructor
  }
}
