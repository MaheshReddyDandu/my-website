import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-distance-calculator',
  templateUrl: './distance-calculator.component.html',
  styleUrls: ['./distance-calculator.component.scss']
})
export class DistanceCalculatorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  isOverlayVisible = false;
  origin = 'New York, NY';
  destination = 'Los Angeles, CA';
  distanceResult: string | null = null;
  map: google.maps.Map | undefined;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  mapLoadError: string | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  ngAfterViewInit(): void {
    if (typeof google === 'undefined' || !google.maps) {
      this.loadGoogleMaps();
      return;
    }
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private loadGoogleMaps(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeMap();
    script.onerror = () => {
      this.mapLoadError = 'Failed to load Google Maps. Please check your connection.';
      this.cdr.detectChanges();
    };
    document.head.appendChild(script);
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
      gestureHandling: 'cooperative'
    });

    this.directionsRenderer.setMap(this.map);
    
    // Optimize map resize handling
    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        setTimeout(() => this.map?.setCenter(this.map.getCenter()!), 100);
      }
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  calculateDistance(): void {
    if (!this.origin || !this.destination) return;

    this.distanceResult = null;
    this.mapLoadError = null;

    this.locationService.getDistance(this.origin, this.destination).subscribe({
      next: (data: any) => {
        if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
          this.distanceResult = data.rows[0].elements[0].distance.text;
          this.showRoute();
          this.isOverlayVisible = true;
        } else {
          this.distanceResult = `Error: ${data.status || 'Invalid response'}`;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching distance:', error);
        this.distanceResult = 'Error calculating distance. Try again.';
        this.cdr.detectChanges();
      }
    });
  }

  closeOverlay(): void {
    this.isOverlayVisible = false;
  }

  showRoute(): void {
    if (!this.map) {
      this.initializeMap();
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed:', status);
        this.mapLoadError = `Error loading route: ${status}`;
      }
      this.cdr.detectChanges();
    });
  }
}