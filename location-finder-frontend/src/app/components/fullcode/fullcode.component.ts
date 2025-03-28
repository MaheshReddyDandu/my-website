import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-fullcode',
  templateUrl: './fullcode.component.html',
  styleUrls: ['./fullcode.component.scss']
})
export class FullcodeComponent implements OnInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  origin = 'New York, NY'; // Default origin
  destination = 'Los Angeles, CA'; // Default destination
  distanceResult: string | null = null;
  map: google.maps.Map | undefined;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.initializeMap()
    this.getAddress(); // Load distance and map on initialization
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
  lat: number | null = 40.7128; // Default: New York, NY latitude
  lng: number | null = -74.0060; // Default: New York, NY longitude
  address: string | null = null;

 


     // Load address and map on initialization
  

  getAddress() {
    if (this.lat !== null && this.lng !== null) {
      this.locationService.getReverseGeocode(this.lat, this.lng).subscribe(
        (data: any) => {
          console.log(data,"mahesh")
          this.address = data.results[0]?.formatted_address || 'Address not found';
        },
        (error) => {
          console.error('Error fetching address:', error);
          this.address = 'Error fetching address';
        }
      );
    }
  }

}
