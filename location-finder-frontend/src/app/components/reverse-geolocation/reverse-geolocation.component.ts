import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { HttpParams } from '@angular/common/http';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-reverse-geolocation',
  templateUrl: './reverse-geolocation.component.html',
  styleUrls: ['./reverse-geolocation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 🚀 Improves Performance
})
export class ReverseGeolocationComponent implements OnInit {
  lat: number | null = 40.7128; // Default to New York for testing
  lng: number | null = -74.0060; // Default to New York for testing
  address: string | null = null;
  errorMessage: string | null = null;
  isGoogleMapsLoaded = false;
  isLocationFetched = false; // Flag to track if location was successfully fetched

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadGoogleMaps();
  }

  // Load Google Maps API script
  loadGoogleMaps() {
    if (this.isGoogleMapsLoaded) return;

    if (window['google'] && window['google'].maps) {
      this.isGoogleMapsLoaded = true;
      // Only fetch the address once the map is ready and the coordinates are available
      if (this.lat !== null && this.lng !== null) {
        this.getAddress();
      }
      return;
    }

    const scriptId = 'googleMapsScript';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`; // Replace with your actual API key
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(() => {
        this.isGoogleMapsLoaded = true;
        // Fetch address only after Google Maps is loaded
        if (this.lat !== null && this.lng !== null) {
          this.getAddress();
        }
        this.cdr.detectChanges();
      }, 500); // 🚀 Non-blocking delay for UI smoothness
    };
    script.onerror = () => {
      this.errorMessage = 'Failed to load Google Maps. Check your API key or connection.';
      this.cdr.detectChanges();
    };

    document.head.appendChild(script);
  }

  // Fetch the user's current position (geolocation)
  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully fetched the location
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.isLocationFetched = true; // Mark location as fetched
          this.getAddress(); // Get address based on current position
        },
        (error) => {
          // Handle location fetch errors
          this.isLocationFetched = false;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              this.errorMessage = 'The request to get user location timed out. Please try again.';
              break;
            default:
              this.errorMessage = 'An unknown error occurred.';
          }
          this.cdr.detectChanges();
        },
        {
          enableHighAccuracy: true, // Try to get a more accurate position
          timeout: 20000, // Timeout after 20 seconds
          maximumAge: 0 // Don't use cached location
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      this.cdr.detectChanges();
    }
  }

  // Fetch the address using the reverse geolocation service
  getAddress() {
    if (!this.isGoogleMapsLoaded) {
      this.errorMessage = 'Google Maps is still loading, please wait.';
      return;
    }

    // Only proceed if lat and lng are available
    if (this.lat !== null && this.lng !== null) {
      this.locationService.getReverseGeocode(this.lat, this.lng).subscribe(
        (data: any) => {
          if (data?.results?.length > 0) {
            this.address = data.results[0].formatted_address;
            this.isLocationFetched = true;
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

  // Close the overlay showing address
  closeAddressOverlay() {
    var ls: number[] =[1,2,3,4,5]
    let vg = ls.map(n=>n *n)
    this.isLocationFetched = false;
  }

}
