import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-distance-calculator',
  templateUrl: './distance-calculator.component.html',
  styleUrls: ['./distance-calculator.component.scss']
})
export class DistanceCalculatorComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  origin = 'New York, NY';
  destination = 'Los Angeles, CA';
  distanceResult: string | null = null;
  map: google.maps.Map | undefined;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  mapLoadError: string | null = null;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.initializeMapWithRetry();
  }

  initializeMapWithRetry(attempts = 3, delay = 1000) {
    if (typeof google === 'undefined' || !google.maps) {
      if (attempts > 0) {
        setTimeout(() => this.initializeMapWithRetry(attempts - 1, delay), delay);
      } else {
        this.mapLoadError = 'Failed to load Google Maps. Please check your connection or API key.';
        this.cdr.detectChanges();
      }
      return;
    }

    if (!this.mapContainer?.nativeElement) {
      this.mapLoadError = 'Map container not available. Please try again.';
      this.cdr.detectChanges();
      return;
    }

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: 4,
      center: { lat: 37.0902, lng: -95.7129 },
      mapTypeControl: false,
      streetViewControl: false
    });
    this.directionsRenderer.setMap(this.map);
    this.mapLoadError = null;
    this.cdr.detectChanges();
  }

  calculateDistance() {
    this.distanceResult = null;
    this.mapLoadError = null;
    this.locationService.getDistance(this.origin, this.destination).subscribe(
      (data: any) => {
        if (data.status === 'OK' && data.rows?.length > 0 && data.rows[0].elements?.length > 0) {
          const element = data.rows[0].elements[0];
          if (element.status === 'OK') {
            this.distanceResult = element.distance.text;
            this.showRoute();
          } else {
            this.distanceResult = `Unable to calculate distance: ${element.status}`;
          }
        } else {
          this.distanceResult = `Unable to calculate distance: ${data.status || 'Invalid response'}`;
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.distanceResult = 'Error calculating distance. Please try again.';
        console.error('Error fetching distance:', error);
        this.cdr.detectChanges();
      }
    );
  }

  showRoute() {
    if (!this.map) {
      this.initializeMapWithRetry();
    }

    const request = {
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsRenderer.setDirections(result);
      } else {
        this.mapLoadError = `Map failed to load route: ${status}`;
        console.error('Directions request failed:', status);
      }
      this.cdr.detectChanges();
    });
  }
}