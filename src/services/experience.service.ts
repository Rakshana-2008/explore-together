import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'https://explore-together-backend-hj7l.onrender.com';
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  private categoryMap: { [key: string]: string } = {
    'Nature & Parks': '["leisure"="park"]',
    'Shopping': '["shop"="mall"]',
    'Study & Work Spots': '["amenity"="library"]',
    'Entertainment': '["amenity"="cinema"]',
    'Spiritual & Heritage': '["amenity"="place_of_worship"]',
    'Adventure & Sports': '["leisure"="sports_centre"]',
    'Hotels': '["tourism"="hotel"]',
    'Restaurants (Veg)': '["amenity"="restaurant"]',
    'Restaurants (Non-Veg)': '["amenity"="restaurant"]',
    'Pharmacies': '["amenity"="pharmacy"]',
    'Hospitals': '["amenity"="hospital"]',
    'Cafes': '["amenity"="cafe"]'
  };

  private stationCoords: { [key: string]: { lat: number; lng: number } } = {
    'Chennai Central': { lat: 13.0827, lng: 80.2707 },
    'Egmore': { lat: 13.0732, lng: 80.2609 },
    'Nehru Park': { lat: 13.0784, lng: 80.2496 },
    'Kilpauk': { lat: 13.0839, lng: 80.2394 },
    "Pachaiyappa's College": { lat: 13.0889, lng: 80.2328 },
    'Shenoy Nagar': { lat: 13.0856, lng: 80.2214 },
    'Anna Nagar East': { lat: 13.0869, lng: 80.2126 },
    'Anna Nagar Tower': { lat: 13.0889, lng: 80.2058 },
    'Thirumangalam': { lat: 13.0889, lng: 80.1983 },
    'Koyambedu': { lat: 13.0694, lng: 80.1948 },
    'CMBT': { lat: 13.0694, lng: 80.1948 },
    'Arumbakkam': { lat: 13.0694, lng: 80.2058 },
    'Vadapalani': { lat: 13.0530, lng: 80.2126 },
    'Ashok Nagar': { lat: 13.0530, lng: 80.2214 },
    'Ekkattuthangal': { lat: 13.0530, lng: 80.2328 },
    'Alandur': { lat: 13.0024, lng: 80.2005 },
    'St. Thomas Mount': { lat: 13.0024, lng: 80.2126 },
    'Wimco Nagar Depot': { lat: 13.1469, lng: 80.2987 },
    'Wimco Nagar': { lat: 13.1469, lng: 80.3058 },
    'Tiruvotriyur': { lat: 13.1469, lng: 80.3058 },
    'Tiruvotriyur Theradi': { lat: 13.1400, lng: 80.3058 },
    'Kaladipet': { lat: 13.1339, lng: 80.2987 },
    'Tollgate': { lat: 13.1209, lng: 80.2987 },
    'New Washermenpet': { lat: 13.1079, lng: 80.2987 },
    'Tondiarpet': { lat: 13.1079, lng: 80.2987 },
    'Sir Theagaraya College': { lat: 13.0949, lng: 80.2847 },
    'Washermenpet': { lat: 13.0949, lng: 80.2847 },
    'Mannadi': { lat: 13.0889, lng: 80.2777 },
    'High Court': { lat: 13.0827, lng: 80.2777 },
    'Government Estate': { lat: 13.0757, lng: 80.2777 },
    'LIC': { lat: 13.0694, lng: 80.2707 },
    'Thousand Lights': { lat: 13.0594, lng: 80.2567 },
    'AG-DMS': { lat: 13.0530, lng: 80.2496 },
    'Teynampet': { lat: 13.0430, lng: 80.2496 },
    'Nandanam': { lat: 13.0330, lng: 80.2394 },
    'Saidapet': { lat: 13.0230, lng: 80.2214 },
    'Little Mount': { lat: 13.0130, lng: 80.2214 },
    'Guindy': { lat: 13.0024, lng: 80.2126 },
    'Nanganallur Road': { lat: 12.9924, lng: 80.2058 },
    'Meenambakkam': { lat: 12.9824, lng: 80.1983 },
    'Airport': { lat: 12.9824, lng: 80.1769 }
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

private buildQuery(tagFilter: string, lat: number, lng: number, radius: number): string {
  return `[out:json][timeout:10];
node${tagFilter}(around:${radius},${lat},${lng});
out 20;`;
}

  private mapResults(elements: any[], category: string): any[] {
    return elements
      .filter((el: any) => el.tags && el.tags.name)
      .map((el: any) => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const addressParts = [
          el.tags['addr:housenumber'],
          el.tags['addr:street'],
          el.tags['addr:suburb'] || el.tags['addr:neighbourhood'],
          el.tags['addr:city'] || 'Chennai'
        ].filter(Boolean);

        return {
          placeId: `osm-${el.type}-${el.id}`,
          name: el.tags.name,
          address: addressParts.length > 0 ? addressParts.join(', ') : 'Chennai, Tamil Nadu',
          rating: null,
          priceLevel: 0,
          photo: null,
          location: { latitude: lat, longitude: lon },
          isOpen: null,
          category
        };
      });
  }

private async queryOverpass(query: string): Promise<any[]> {
  const endpoints = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass-api.de/api/interpreter'
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) continue;
      const text = await response.text();
      if (text.includes('DOCTYPE') || text.includes('<html')) continue;
      const data = JSON.parse(text);
      if (data.elements) return data.elements;
    } catch (e) {
      continue;
    }
  }
  return [];
}

  getNearbyExperiences(lat: number, lng: number, category: string, radius: number, budget?: string): Observable<any> {
    const tagFilter = this.categoryMap[category] || '["tourism"="attraction"]';
    const query = this.buildQuery(tagFilter, lat, lng, radius);

    return from(
      this.queryOverpass(query).then(elements => this.mapResults(elements, category))
    );
  }

  getExperiencesByStation(stationName: string, category?: string): Observable<any> {
    const coords = this.stationCoords[stationName];
    if (!coords) return from(Promise.resolve([]));

    const tagFilter = category
      ? (this.categoryMap[category] || '["tourism"="attraction"]')
      : '["amenity"="restaurant"]';
    const query = this.buildQuery(tagFilter, coords.lat, coords.lng, 2000);

    return from(
      this.queryOverpass(query).then(elements => this.mapResults(elements, category || 'General'))
    );
  }
}