import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private BASE_URL = 'https://findgps-coordinates.com/api';
  // private BASE_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  
  getReverseGeocode(lat: number, lng: number) {
    return this.http.get(`${this.BASE_URL}/reverse-geocode?lat=${lat}&lng=${lng}`);
  }

  getDistance(origin: string, destination: string) {
    return this.http.get(`${this.BASE_URL}/calculate-distance?origin=${origin}&destination=${destination}`);
  }
}
