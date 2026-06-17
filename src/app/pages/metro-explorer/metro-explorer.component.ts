import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperienceService } from '../../../services/experience.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-metro-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metro-explorer.component.html',
  styleUrl: './metro-explorer.component.scss'
})
export class MetroExplorerComponent implements OnInit {
  greenLine: any[] = [];
  blueLine: any[] = [];
  selectedStation: string = '';
  selectedCategory: string = '';
  experiences: any[] = [];
  loading = false;
  nearestStation: any = null;

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

  constructor(
    private experienceService: ExperienceService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const stations = this.locationService.getAllStations();
    this.greenLine = stations.filter(s => s.line === 'Green');
    this.blueLine = stations.filter(s => s.line === 'Blue');

    this.locationService.getCurrentLocation().subscribe({
      next: (coords) => {
        this.nearestStation = this.locationService.getNearestStation(coords);
      },
      error: () => {}
    });

    this.route.queryParams.subscribe(params => {
      if (params['station']) {
        this.selectedStation = params['station'];
        this.loadExperiences();
      }
    });
  }

  selectStation(stationName: string) {
    this.selectedStation = stationName;
    this.experiences = [];
    if (this.selectedCategory) {
      this.loadExperiences();
    }
  }

  loadExperiences() {
    if (!this.selectedStation) return;
    this.loading = true;
    this.experienceService.getExperiencesByStation(
      this.selectedStation,
      this.selectedCategory
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