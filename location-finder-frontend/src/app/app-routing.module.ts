import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistanceCalculatorComponent } from 'src/app/components/distance-calculator/distance-calculator.component';
import { ReverseGeolocationComponent } from 'src/app/components/reverse-geolocation/reverse-geolocation.component';
import { FullcodeComponent } from './components/fullcode/fullcode.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'distance-calculator', component: DistanceCalculatorComponent },
  { path: 'reverse-geolocation', component: ReverseGeolocationComponent },
  { path: 'location-finder', component: FullcodeComponent },
  { path: 'home', component: AppComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
