import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  declare global {
    interface Window {
      initMap: () => void;
    }
  }
  
  window.initMap = () => {
    console.log('Google Maps API Loaded');
  };
  