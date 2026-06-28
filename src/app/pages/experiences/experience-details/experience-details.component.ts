import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-experience-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-details.component.html',
  styleUrl: './experience-details.component.scss'
})
export class ExperienceDetailsComponent implements OnInit {
  experience: any = null;
  isSaved = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const state = history.state;
    if (state && state.experience) {
      this.experience = state.experience;
      this.checkIfSaved();
    } else {
      this.router.navigate(['/experiences']);
    }
  }

  checkIfSaved() {
    this.userService.getSavedExperiences().subscribe({
      next: (saved: any[]) => {
        this.isSaved = saved.some(s => s.placeId === this.experience.placeId);
      },
      error: () => {}
    });
  }

  toggleSave() {
    if (this.isSaved) {
      this.userService.removeExperience(this.experience.placeId).subscribe({
        next: () => { this.isSaved = false; }
      });
    } else {
      this.userService.saveExperience(this.experience).subscribe({
        next: () => { this.isSaved = true; }
      });
    }
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

  getCategoryEmoji(category: string): string {
    const emojis: { [key: string]: string } = {
      'Nature & Parks': '🌿',
      'Shopping': '🛍️',
      'Study & Work Spots': '📚',
      'Entertainment': '🎭',
      'Spiritual & Heritage': '🕌',
      'Adventure & Sports': '⚡',
      'Hotels': '🏨',
      'Restaurants (Veg)': '🥗',
      'Restaurants (Non-Veg)': '🍖',
      'Pharmacies': '💊',
      'Hospitals': '🏥',
      'Cafes': '☕'
    };
    return emojis[category] || '📍';
  }

  openInMaps() {
    if (this.experience.location) {
      const lat = this.experience.location.latitude || this.experience.location.lat;
      const lng = this.experience.location.longitude || this.experience.location.lng;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/experiences']);
  }
}