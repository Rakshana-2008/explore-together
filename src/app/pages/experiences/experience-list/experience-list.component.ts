import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExperienceService } from '../../../../services/experience.service';
import { LocationService } from '../../../../services/location.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experience-list.component.html',
  styleUrl: './experience-list.component.scss'
})
export class ExperienceListComponent implements OnInit {
  experiences: any[] = [];
  loading = false;
  locationError = false;
  filtersApplied = false;
  savedPlaceIds: string[] = [];

 categories = [
  'Nature & Parks',
  'Shopping',
  'Study & Work Spots',
  'Entertainment',
  'Spiritual & Heritage',
  'Adventure & Sports',
  'Hotels',
  'Restaurants (Veg)',
  'Restaurants (Non-Veg)',
  'Pharmacies',
  'Hospitals',
  'Cafes'
];

  budgets = ['Free', 'Under ₹200', '₹200–₹500', '₹500–₹1000', '₹1000+'];
  radii = [
    { label: 'Within 1 km', value: 1000 },
    { label: 'Within 3 km', value: 3000 },
    { label: 'Within 5 km', value: 5000 },
    { label: 'Within 10 km', value: 10000 }
  ];

  selectedCategory = '';
  selectedBudget = '';
  selectedRadius = 5000;
  userCoords: any = null;

  constructor(
    private experienceService: ExperienceService,
    private locationService: LocationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadSavedExperiences();
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
    });
    this.getLocation();
  }

  loadSavedExperiences() {
    this.userService.getSavedExperiences().subscribe({
      next: (saved: any[]) => {
        this.savedPlaceIds = saved.map(s => s.placeId);
      },
      error: () => {}
    });
  }

  getLocation() {
    this.loading = true;
    this.locationService.getCurrentLocation().subscribe({
      next: (coords) => {
        this.userCoords = coords;
        if (this.selectedCategory) {
          this.searchExperiences();
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.locationError = true;
      }
    });
  }

  searchExperiences() {
    if (!this.selectedCategory) {
      alert('Please select a category');
      return;
    }
    if (!this.userCoords) {
      alert('Location not available. Please allow location access.');
      return;
    }
    this.loading = true;
    this.filtersApplied = true;
    this.experienceService.getNearbyExperiences(
      this.userCoords.lat,
      this.userCoords.lng,
      this.selectedCategory,
      this.selectedRadius,
      this.selectedBudget
    ).subscribe({
      next: (data: any[]) => {
        this.experiences = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleSave(experience: any) {
    if (this.isSaved(experience.placeId)) {
      this.userService.removeExperience(experience.placeId).subscribe({
        next: () => {
          this.savedPlaceIds = this.savedPlaceIds.filter(id => id !== experience.placeId);
        }
      });
    } else {
      this.userService.saveExperience(experience).subscribe({
        next: () => {
          this.savedPlaceIds.push(experience.placeId);
        }
      });
    }
  }

  isSaved(placeId: string): boolean {
    return this.savedPlaceIds.includes(placeId);
  }

  goToDetails(experience: any) {
    this.router.navigate(['/experiences', experience.placeId], {
      state: { experience }
    });
  }

  getPriceLabel(level: number): string {
    const labels: { [key: number]: string } = {
      0: 'Free',
      1: 'Budget (₹)',
      2: 'Moderate (₹₹)',
      3: 'Expensive (₹₹₹)',
      4: 'Very Expensive (₹₹₹₹)'
    };
    return labels[level] || 'Price varies';
  }
}