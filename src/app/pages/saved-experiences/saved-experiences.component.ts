import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-saved-experiences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-experiences.component.html',
  styleUrl: './saved-experiences.component.scss'
})
export class SavedExperiencesComponent implements OnInit {
  savedExperiences: any[] = [];
  loading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadSaved();
  }

  loadSaved() {
    this.loading = true;
    this.userService.getSavedExperiences().subscribe({
      next: (data: any[]) => {
        this.savedExperiences = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  removeExperience(placeId: string) {
    this.userService.removeExperience(placeId).subscribe({
      next: () => {
        this.savedExperiences = this.savedExperiences.filter(e => e.placeId !== placeId);
      }
    });
  }

  goToDetails(experience: any) {
    this.router.navigate(['/experiences', experience.placeId], {
      state: { experience }
    });
  }
}