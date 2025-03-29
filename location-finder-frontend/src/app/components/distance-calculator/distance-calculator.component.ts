import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-distance-calculator',
  templateUrl: './distance-calculator.component.html',
  styleUrls: ['./distance-calculator.component.scss']
})
export class DistanceCalculatorComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  isOverlayVisible = false;
  origin = 'New York, NY';
  destination = 'Los Angeles, CA';
  distanceResult: string | null = null;
  map: google.maps.Map | undefined;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  mapLoadError: string | null = null;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  ngAfterViewInit(): void {
    if (typeof google === 'undefined' || !google.maps) {
      this.mapLoadError = 'Google Maps API is not available. Check your internet connection or API key.';
      this.cdr.detectChanges();
      return;
    }
    
    setTimeout(() => {
      this.initializeMap();
    }, 850);

    
  }

  initializeMap(): void {
    if (!this.mapContainer?.nativeElement) {
      this.mapLoadError = 'Map container is missing.';
      this.cdr.detectChanges();
      return;
    }

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: 4,
      center: { lat: 37.0902, lng: -95.7129 },
      disableDefaultUI: true,
    });

    this.directionsRenderer.setMap(this.map);
    this.mapLoadError = null;
    this.cdr.detectChanges();
  }

  // calculateDistance(): void {
  //   if (!this.origin || !this.destination) return;

  //   this.distanceResult = null;
  //   this.mapLoadError = null;

  //   this.locationService.getDistance(this.origin, this.destination).subscribe(
  //     (data: any) => {
  //       if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
  //         this.distanceResult = data.rows[0].elements[0].distance.text;
  //         this.showRoute();
  //       } else {
  //         this.distanceResult = `Error: ${data.status || 'Invalid response'}`;
  //       }
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       console.error('Error fetching distance:', error);
  //       this.distanceResult = 'Error calculating distance. Try again.';
  //       this.cdr.detectChanges();
  //     }
  //   );
  // }
  

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
            this.isOverlayVisible = true; // Show overlay
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
  
  closeOverlay() {
    this.isOverlayVisible = false;
  }
  showRoute(): void {
    if (!this.map) {
      this.initializeMap();
    }
  
    setTimeout(() => {
      if (!this.map) {
        console.error("Map is not initialized properly.");
        return;
      }
  
      const request: google.maps.DirectionsRequest = {
        origin: this.origin,
        destination: this.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };
  
      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          this.directionsRenderer.setMap(this.map || null); // Explicitly set map or null
          this.directionsRenderer.setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          this.mapLoadError = `Error loading route: ${status}`;
        }
        this.cdr.detectChanges();
      });
    }, 500);
  }
  
  
}
