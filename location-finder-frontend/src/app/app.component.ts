import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  distanceCalcLoaded = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.distanceCalcLoaded = true;
    }, 500); // Small delay to ensure full rendering
  }
}
