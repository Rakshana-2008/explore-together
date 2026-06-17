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

  openInMaps() {
    if (this.experience.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.experience.location.latitude},${this.experience.location.longitude}`;
      window.open(url, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/experiences']);
  }
}