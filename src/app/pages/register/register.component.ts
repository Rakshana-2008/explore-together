import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  step: 'register' | 'otp' = 'register';
  name = '';
  phone = '';
  email = '';
  password = '';
  otp = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.name || !this.email || !this.password || !this.phone) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.authService.register({
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.step = 'otp';
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }

  onVerifyOtp() {
    if (!this.otp) {
      this.errorMessage = 'Please enter OTP';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid OTP';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}