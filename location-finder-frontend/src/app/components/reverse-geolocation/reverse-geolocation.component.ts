import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-reverse-geolocation',
  templateUrl: './reverse-geolocation.component.html',
  styleUrls: ['./reverse-geolocation.component.scss']
})
export class ReverseGeolocationComponent implements OnInit {
  lat: number | null = 40.7128;
  lng: number | null = -74.0060;
  address: string | null = null;
  errorMessage: string | null = null;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAddress();
  }

  getAddress() {
    this.address = null;
    this.errorMessage = null;
    if (this.lat !== null && this.lng !== null) {
      this.locationService.getReverseGeocode(this.lat, this.lng).subscribe(
        (data: any) => {
          if (data?.results?.length > 0) {
            this.address = data.results[0].formatted_address;
          } else {
            this.address = 'Address not found';
          }
          this.cdr.detectChanges();
        },
        (error) => {
          this.errorMessage = 'Error fetching address. Please try again.';
          console.error('Error fetching address:', error);
          this.cdr.detectChanges();
        }
      );
    } else {
      this.errorMessage = 'Please enter valid latitude and longitude.';
      this.cdr.detectChanges();
    }
  }
}