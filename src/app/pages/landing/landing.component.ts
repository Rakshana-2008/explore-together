import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  features = [
    {
      icon: '📍',
      title: 'GPS-Powered Discovery',
      description: 'Find experiences right where you are. Our app detects your location and shows what\'s nearby instantly.'
    },
    {
      icon: '🚇',
      title: 'Chennai Metro Explorer',
      description: 'Select any metro station and discover what\'s around it. Perfect for planning your next outing.'
    },
    {
      icon: '🔖',
      title: 'Save Your Favourites',
      description: 'Bookmark places you love or want to visit. Build your personal Chennai bucket list.'
    },
    {
      icon: '🎭',
      title: '12 Categories',
      description: 'From cafes to hospitals, parks to hotels — find exactly what you\'re looking for.'
    },
    {
      icon: '🥗',
      title: 'Veg & Non-Veg',
      description: 'Filter restaurants by dietary preference. Find the perfect spot for every taste.'
    },
    {
      icon: '🔐',
      title: 'Secure & Private',
      description: 'Your data is protected with JWT authentication and OTP verification.'
    }
  ];

  stats = [
    { number: '2', label: 'Metro Lines' },
    { number: '45+', label: 'Metro Stations' },
    { number: '12', label: 'Categories' },
    { number: '∞', label: 'Experiences' }
  ];

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}