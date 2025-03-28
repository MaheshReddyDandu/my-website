

import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-reverse-geolocation',
  templateUrl: './reverse-geolocation.component.html',
  styleUrls: ['./reverse-geolocation.component.scss']
})
export class ReverseGeolocationComponent implements OnInit {
  lat: number | null = 40.7128; // Default: New York, NY latitude
  lng: number | null = -74.0060; // Default: New York, NY longitude
  address: string | null = null;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.getAddress(); // Load address and map on initialization
  }

  getAddress() {
    if (this.lat !== null && this.lng !== null) {
      console.log(`Fetching address for lat=${this.lat}, lng=${this.lng}`);
  
      this.locationService.getReverseGeocode(this.lat, this.lng).subscribe(
        (data: any) => {
          console.log("API Response:", data);
          if (data?.results?.length > 0) {
            this.address = data.results[0].formatted_address;
          } else {
            this.address = "Address not found";
          }
        },
        (error) => {
          console.error("Error fetching address:", error);
          this.address = "Error fetching address";
        }
      );
    }
  }
  
}