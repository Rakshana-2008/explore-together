import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  editMode = false;
  loading = true;
  saving = false;
  successMessage = '';

  editName = '';
  editEmail = '';
  editPhone = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (data: any) => {
        this.user = data;
        this.editName = data.name;
        this.editEmail = data.email;
        this.editPhone = data.phone;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    this.successMessage = '';
  }

  saveProfile() {
    this.saving = true;
    this.userService.updateProfile({
      name: this.editName,
      email: this.editEmail,
      phone: this.editPhone
    }).subscribe({
      next: (data: any) => {
        this.user = { ...this.user, ...data };
        this.saving = false;
        this.editMode = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToSaved() {
    this.router.navigate(['/saved']);
  }
}