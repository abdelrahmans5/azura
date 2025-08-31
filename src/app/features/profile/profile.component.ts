import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService)

  userData: any;

  ngOnInit(): void {
      this.userData =  this.authService.decodeToken();
  }


  activeTab: 'personal' | 'orders' | 'security' = 'personal';

  userProfile: UserProfile = {
    name: 'Quantum User',
    email: 'user@nexus.com',
    phone: '01234567890',
    joinDate: 'August 2025'
  };
  

}
