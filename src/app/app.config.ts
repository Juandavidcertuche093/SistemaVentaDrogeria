import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors, withFetch,} from '@angular/common/http'; //para hacer el llamado a la Api
import {injectSessionInterceptor} from './core/interceptors/inject-session.interceptor'

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
      provideClientHydration(),
      provideAnimationsAsync(),
      provideHttpClient(withInterceptors([injectSessionInterceptor]), withFetch())
    ]
};
