import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { API_CONFIG } from './api.token';
import { ApiConfig } from './api.type';

@NgModule()
export class ApiModule {
    constructor(@Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('RedApiModule is already loaded. Import it in the AppModule only!');
        }
    }
    static forRoot(config: Partial<ApiConfig>): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [
                {
                    provide: API_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}
