import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'http://localhost:5000/api/experiences';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  getNearbyExperiences(lat: number, lng: number, category: string, radius: number, budget?: string): Observable<any> {
    let params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('category', category)
      .set('radius', radius.toString());

    if (budget) {
      params = params.set('budget', budget);
    }

    return this.http.get(`${this.apiUrl}/nearby`, {
      headers: this.getHeaders(),
      params
    });
  }

  getExperiencesByStation(stationName: string, category?: string): Observable<any> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get(`${this.apiUrl}/station/${encodeURIComponent(stationName)}`, {
      headers: this.getHeaders(),
      params
    });
  }
}