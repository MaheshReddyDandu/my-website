import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { DistanceCalculatorComponent } from './components/distance-calculator/distance-calculator.component';
import { ReverseGeolocationComponent } from './components/reverse-geolocation/reverse-geolocation.component';
import { FullcodeComponent } from './components/fullcode/fullcode.component';

@NgModule({
  declarations: [
    AppComponent,
    DistanceCalculatorComponent,
    ReverseGeolocationComponent,
    FullcodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    GoogleMapsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
