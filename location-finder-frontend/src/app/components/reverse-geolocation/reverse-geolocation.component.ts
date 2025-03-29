import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-reverse-geolocation',
  templateUrl: './reverse-geolocation.component.html',
  styleUrls: ['./reverse-geolocation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 🚀 Improves Performance
})
export class ReverseGeolocationComponent implements OnInit {
  lat: number | null = 40.7128;
  lng: number | null = -74.0060;
  address: string | null = null;
  errorMessage: string | null = null;
  isGoogleMapsLoaded = false;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    if (this.isGoogleMapsLoaded) return;

    if (window['google'] && window['google'].maps) {
      this.isGoogleMapsLoaded = true;
      this.getAddress();
      return;
    }

    const scriptId = 'googleMapsScript';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(() => {
        this.isGoogleMapsLoaded = true;
        this.getAddress();
        this.cdr.detectChanges();
      }, 500); // 🚀 Non-blocking delay for UI smoothness
    };
    script.onerror = () => {
      this.errorMessage = 'Failed to load Google Maps. Check your API key or connection.';
      this.cdr.detectChanges();
    };

    document.head.appendChild(script);
  }
  isAddressOverlayVisible = false;
  getAddress() {
    if (!this.isGoogleMapsLoaded) {
      this.errorMessage = 'Google Maps is still loading, please wait.';
      return;
    }

    this.address = null;
    this.errorMessage = null;

    if (this.lat !== null && this.lng !== null) {
      this.locationService.getReverseGeocode(this.lat, this.lng).subscribe(
        (data: any) => {
          if (data?.results?.length > 0) {
            this.address = data.results[0].formatted_address;
            this.isAddressOverlayVisible = true; 
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
  
closeAddressOverlay() {
  this.isAddressOverlayVisible = false;
}
}
