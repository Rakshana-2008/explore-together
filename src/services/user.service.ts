import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://explore-together-production.up.railway.app/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getHeaders()
    });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, {
      headers: this.getHeaders()
    });
  }

  getSavedExperiences(): Observable<any> {
    return this.http.get(`${this.apiUrl}/saved`, {
      headers: this.getHeaders()
    });
  }

  saveExperience(experience: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/saved`, experience, {
      headers: this.getHeaders()
    });
  }

  removeExperience(placeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/saved/${placeId}`, {
      headers: this.getHeaders()
    });
  }
}