import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

const MiTema = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f7f3',
      100: '#d9ecdf',
      200: '#b3d9c0',
      300: '#8cc5a1',
      400: '#5ba378',
      500: '#2F6B4F',
      600: '#295f46',
      700: '#1F4A36',
      800: '#173726',
      900: '#0f2519',
      950: '#081410'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: MiTema,
        options: {
          darkModeSelector: false
        }
      }
    })
  ]
};