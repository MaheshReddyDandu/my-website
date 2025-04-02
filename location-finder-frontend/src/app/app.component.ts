import { Component, AfterViewInit ,OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor( private router: Router) {}
  distanceCalcLoaded = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.distanceCalcLoaded = true;
      this.router.navigate(['/home']);
    }, 500); // Small delay to ensure full rendering
  }
}
