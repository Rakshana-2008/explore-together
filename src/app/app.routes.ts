import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'experiences',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/experiences/experience-list/experience-list.component').then(m => m.ExperienceListComponent)
  },
  {
    path: 'experiences/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/experiences/experience-details/experience-details.component').then(m => m.ExperienceDetailsComponent)
  },
  {
    path: 'metro-explorer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/metro-explorer/metro-explorer.component').then(m => m.MetroExplorerComponent)
  },
  {
    path: 'saved',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/saved-experiences/saved-experiences.component').then(m => m.SavedExperiencesComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: 'login' }
];
