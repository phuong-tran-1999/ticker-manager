import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { thirdPartyProviders } from './app.provider';
import { appRoutes } from './app.routes';
import { ApiModule } from '@shared/core';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideAnimationsAsync(),
        provideHttpClient(),
        importProvidersFrom(
            ApiModule.forRoot({
                apiHost: environment.apiUrl,
                apiPrefix: 'api',
            }),
        ),
        ...thirdPartyProviders,
    ],
};
