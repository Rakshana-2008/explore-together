import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  isScrolled = false;
  heroVisible = false;
  statsVisible = false;
  howVisible = false;
  featuresVisible = false;
  metroVisible = false;
  categoriesVisible = false;

  particles = Array.from({ length: 20 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    size: Math.random() * 6 + 3
  }));

  marqueeItems = [
    '☕ Cafes', '🌿 Parks', '🏥 Hospitals', '🛍️ Shopping',
    '🏨 Hotels', '🕌 Heritage', '🥗 Veg Food', '🍖 Non-Veg',
    '💊 Pharmacies', '⚡ Sports', '📚 Libraries', '🎭 Entertainment'
  ];

  stats = [
    { icon: '🚇', number: '2', label: 'Metro Lines' },
    { icon: '📍', number: '45+', label: 'Stations' },
    { icon: '🗂️', number: '12', label: 'Categories' },
    { icon: '🌟', number: '∞', label: 'Experiences' }
  ];

  steps = [
    { icon: '📝', title: 'Create Account', description: 'Sign up in seconds with your email and phone number. No credit card needed.' },
    { icon: '📍', title: 'Share Location', description: 'Allow location access and we\'ll instantly find your nearest metro station.' },
    { icon: '🔍', title: 'Pick a Category', description: 'Choose from 12 categories — cafes, parks, hospitals, hotels and more.' },
    { icon: '🎉', title: 'Start Exploring', description: 'Discover real places near you or explore by Chennai Metro station.' }
  ];

  features = [
    { icon: '📍', title: 'GPS Discovery', description: 'Real-time location detection to find experiences exactly where you are.', color: '#2ec4b6', bg: 'rgba(46,196,182,0.1)' },
    { icon: '🚇', title: 'Metro Explorer', description: 'Click any of 45+ metro stations to discover what\'s within 2km.', color: '#4caf50', bg: 'rgba(76,175,80,0.1)' },
    { icon: '🔖', title: 'Save Favourites', description: 'Bookmark places and build your personal Chennai bucket list.', color: '#ff9800', bg: 'rgba(255,152,0,0.1)' },
    { icon: '🥗', title: 'Veg & Non-Veg', description: 'Filter restaurants by dietary preference instantly.', color: '#e91e63', bg: 'rgba(233,30,99,0.1)' },
    { icon: '🔐', title: 'Secure Login', description: 'JWT authentication with OTP verification keeps your account safe.', color: '#9c27b0', bg: 'rgba(156,39,176,0.1)' },
    { icon: '📱', title: 'Mobile Ready', description: 'Fully responsive design works beautifully on any device.', color: '#2196f3', bg: 'rgba(33,150,243,0.1)' }
  ];

  greenStations = ['Chennai Central', 'Egmore', 'Kilpauk', 'Anna Nagar', 'Koyambedu', 'Vadapalani', 'Alandur'];
  blueStations = ['Wimco Nagar', 'Tondiarpet', 'High Court', 'Thousand Lights', 'Teynampet', 'Guindy', 'Airport'];

  allCategories = [
    { icon: '🌿', name: 'Nature & Parks' },
    { icon: '🛍️', name: 'Shopping' },
    { icon: '📚', name: 'Study Spots' },
    { icon: '🎭', name: 'Entertainment' },
    { icon: '🕌', name: 'Spiritual' },
    { icon: '⚡', name: 'Adventure' },
    { icon: '🏨', name: 'Hotels' },
    { icon: '🥗', name: 'Veg Food' },
    { icon: '🍖', name: 'Non-Veg' },
    { icon: '💊', name: 'Pharmacies' },
    { icon: '🏥', name: 'Hospitals' },
    { icon: '☕', name: 'Cafes' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => this.heroVisible = true, 100);
    setTimeout(() => this.checkVisibility(), 500);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
    this.checkVisibility();
  }

  checkVisibility() {
    const scrollY = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const progress = scrollY / docHeight;

    if (progress > 0.2) this.statsVisible = true;
    if (progress > 0.3) this.howVisible = true;
    if (progress > 0.45) this.featuresVisible = true;
    if (progress > 0.6) this.metroVisible = true;
    if (progress > 0.75) this.categoriesVisible = true;
  }

  goToLogin() { this.router.navigate(['/login']); }
  goToRegister() { this.router.navigate(['/register']); }
}