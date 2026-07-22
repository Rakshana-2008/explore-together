import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  nearestStation: any = null;
  locationLoading = true;

categories = [
  { icon: '🌿', title: 'Nature & Parks', description: 'Parks, beaches and peaceful escapes.', filter: 'Nature & Parks' },
  { icon: '🛍️', title: 'Shopping', description: 'Malls, markets and retail therapy.', filter: 'Shopping' },
  { icon: '📚', title: 'Study & Work Spots', description: 'Libraries, cafes and productive spaces.', filter: 'Study & Work Spots' },
  { icon: '🎭', title: 'Entertainment', description: 'Entertainment and social spots.', filter: 'Entertainment' },
  { icon: '🕌', title: 'Spiritual & Heritage', description: 'Temples, churches and heritage sites.', filter: 'Spiritual & Heritage' },
  { icon: '⚡', title: 'Adventure & Sports', description: 'Thrilling activities and sports venues.', filter: 'Adventure & Sports' },
  { icon: '🏨', title: 'Hotels', description: 'Find hotels and stays near you.', filter: 'Hotels' },
  { icon: '🥗', title: 'Veg Restaurants', description: 'Pure vegetarian dining options.', filter: 'Restaurants (Veg)' },
  { icon: '🍖', title: 'Non-Veg Restaurants', description: 'Non-vegetarian dining options.', filter: 'Restaurants (Non-Veg)' },
  { icon: '💊', title: 'Pharmacies', description: 'Nearby medical stores.', filter: 'Pharmacies' },
  { icon: '🏥', title: 'Hospitals', description: 'Hospitals and clinics nearby.', filter: 'Hospitals' },
  { icon: '☕', title: 'Cafes', description: 'Coffee shops and cafes near you.', filter: 'Cafes' },
];

  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.detectLocation();
  }

detectLocation() {
  this.locationService.getCurrentLocation().subscribe({
    next: (coords) => {
      this.userCoords = coords;
      this.nearestStation = this.locationService.getNearestStation(coords);
      this.locationLoading = false;
    },
    error: () => {
      this.locationLoading = false;
    }
  });
}

  goToCategory(filter: string) {
    this.router.navigate(['/experiences'], { queryParams: { category: filter } });
  }

  goToMetro() {
    this.router.navigate(['/metro-explorer']);
  }

  goToNearestStation() {
    if (this.nearestStation) {
      this.router.navigate(['/metro-explorer'], {
        queryParams: { station: this.nearestStation.name }
      });
    }
  }
}