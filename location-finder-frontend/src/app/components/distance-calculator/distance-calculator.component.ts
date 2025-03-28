import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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

  constructor(private locationService: LocationService) {}

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error("Map container not found");
      return;
    }

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      zoom: 4,
      center: { lat: 37.0902, lng: -95.7129 } // Center of USA
    });
    this.directionsRenderer.setMap(this.map);
  }

  calculateDistance() {
    this.distanceResult = null;
    this.locationService.getDistance(this.origin, this.destination).subscribe(
      (data: any) => {
        console.log('API Response:', data);
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
      },
      (error) => {
        console.error("Error fetching distance:", error);
        this.distanceResult = "Error calculating distance.";
      }
    );
  }

  showRoute() {
    if (!this.map) {
      this.initializeMap();
    }

    const request = {
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      console.log('Directions Response:', result, 'Status:', status);
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error("Directions request failed:", status);
        this.distanceResult = `Map failed to load: ${status}`;
      }
    });
  }
}
