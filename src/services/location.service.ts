import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MetroStation {
  name: string;
  line: string;
  coords: Coordinates;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private metroStations: MetroStation[] = [
    // Green Line
    { name: 'Chennai Central', line: 'Green', coords: { lat: 13.0827, lng: 80.2707 } },
    { name: 'Egmore', line: 'Green', coords: { lat: 13.0732, lng: 80.2609 } },
    { name: 'Nehru Park', line: 'Green', coords: { lat: 13.0784, lng: 80.2496 } },
    { name: 'Kilpauk', line: 'Green', coords: { lat: 13.0839, lng: 80.2394 } },
    { name: 'Pachaiyappa\'s College', line: 'Green', coords: { lat: 13.0889, lng: 80.2328 } },
    { name: 'Shenoy Nagar', line: 'Green', coords: { lat: 13.0856, lng: 80.2214 } },
    { name: 'Anna Nagar East', line: 'Green', coords: { lat: 13.0869, lng: 80.2126 } },
    { name: 'Anna Nagar Tower', line: 'Green', coords: { lat: 13.0889, lng: 80.2058 } },
    { name: 'Thirumangalam', line: 'Green', coords: { lat: 13.0889, lng: 80.1983 } },
    { name: 'Koyambedu', line: 'Green', coords: { lat: 13.0694, lng: 80.1948 } },
    { name: 'CMBT', line: 'Green', coords: { lat: 13.0694, lng: 80.1948 } },
    { name: 'Arumbakkam', line: 'Green', coords: { lat: 13.0694, lng: 80.2058 } },
    { name: 'Vadapalani', line: 'Green', coords: { lat: 13.0530, lng: 80.2126 } },
    { name: 'Ashok Nagar', line: 'Green', coords: { lat: 13.0530, lng: 80.2214 } },
    { name: 'Ekkattuthangal', line: 'Green', coords: { lat: 13.0530, lng: 80.2328 } },
    { name: 'Alandur', line: 'Green', coords: { lat: 13.0024, lng: 80.2005 } },
    { name: 'St. Thomas Mount', line: 'Green', coords: { lat: 13.0024, lng: 80.2126 } },
    // Blue Line
    { name: 'Wimco Nagar Depot', line: 'Blue', coords: { lat: 13.1469, lng: 80.2987 } },
    { name: 'Wimco Nagar', line: 'Blue', coords: { lat: 13.1469, lng: 80.3058 } },
    { name: 'Tiruvotriyur', line: 'Blue', coords: { lat: 13.1469, lng: 80.3058 } },
    { name: 'Tiruvotriyur Theradi', line: 'Blue', coords: { lat: 13.1400, lng: 80.3058 } },
    { name: 'Kaladipet', line: 'Blue', coords: { lat: 13.1339, lng: 80.2987 } },
    { name: 'Tollgate', line: 'Blue', coords: { lat: 13.1209, lng: 80.2987 } },
    { name: 'New Washermenpet', line: 'Blue', coords: { lat: 13.1079, lng: 80.2987 } },
    { name: 'Tondiarpet', line: 'Blue', coords: { lat: 13.1079, lng: 80.2987 } },
    { name: 'Sir Theagaraya College', line: 'Blue', coords: { lat: 13.0949, lng: 80.2847 } },
    { name: 'Washermenpet', line: 'Blue', coords: { lat: 13.0949, lng: 80.2847 } },
    { name: 'Mannadi', line: 'Blue', coords: { lat: 13.0889, lng: 80.2777 } },
    { name: 'High Court', line: 'Blue', coords: { lat: 13.0827, lng: 80.2777 } },
    { name: 'Chennai Central', line: 'Blue', coords: { lat: 13.0827, lng: 80.2707 } },
    { name: 'Government Estate', line: 'Blue', coords: { lat: 13.0757, lng: 80.2777 } },
    { name: 'LIC', line: 'Blue', coords: { lat: 13.0694, lng: 80.2707 } },
    { name: 'Thousand Lights', line: 'Blue', coords: { lat: 13.0594, lng: 80.2567 } },
    { name: 'AG-DMS', line: 'Blue', coords: { lat: 13.0530, lng: 80.2496 } },
    { name: 'Teynampet', line: 'Blue', coords: { lat: 13.0430, lng: 80.2496 } },
    { name: 'Nandanam', line: 'Blue', coords: { lat: 13.0330, lng: 80.2394 } },
    { name: 'Saidapet', line: 'Blue', coords: { lat: 13.0230, lng: 80.2214 } },
    { name: 'Little Mount', line: 'Blue', coords: { lat: 13.0130, lng: 80.2214 } },
    { name: 'Guindy', line: 'Blue', coords: { lat: 13.0024, lng: 80.2126 } },
    { name: 'Alandur', line: 'Blue', coords: { lat: 13.0024, lng: 80.2005 } },
    { name: 'Nanganallur Road', line: 'Blue', coords: { lat: 12.9924, lng: 80.2058 } },
    { name: 'Meenambakkam', line: 'Blue', coords: { lat: 12.9824, lng: 80.1983 } },
    { name: 'Airport', line: 'Blue', coords: { lat: 12.9824, lng: 80.1769 } }
  ];

  getCurrentLocation(): Observable<Coordinates> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        position => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          observer.complete();
        },
        error => observer.error(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  getNearestStation(userCoords: Coordinates): MetroStation {
    let nearest = this.metroStations[0];
    let minDistance = this.getDistance(userCoords, nearest.coords);

    this.metroStations.forEach(station => {
      const distance = this.getDistance(userCoords, station.coords);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return nearest;
  }

  getDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371;
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLng = this.toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  getAllStations(): MetroStation[] {
    return this.metroStations;
  }
}