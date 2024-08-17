import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DEFAULT_CONFIG } from './api.constant';
import { API_CONFIG } from './api.token';
import { timeout } from 'rxjs';
import { ApiConfig } from './api.type';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private _http = inject(HttpClient);
    private _userConfig = inject(API_CONFIG);

    private _config: ApiConfig = { ...DEFAULT_CONFIG, ...this._userConfig };

    private _createApiUrl(url: string, params: Record<string, any> = {}) {
        const { apiHost, apiPrefix } = this._config;

        const paths = url.split('/');
        paths.forEach((path, i) => {
            if (path.startsWith(':')) {
                const key = path.slice(1);

                paths[i] = params[key];
                delete params[key];
            }
        });

        return apiHost + apiPrefix + paths.join('/');
    }

    get<T>(url: string, params: Record<string, unknown> = {}) {
        return this._http.get<T>(this._createApiUrl(url, params)).pipe(timeout(this._config.timeout));
    }

    post<T>(url: string, data: unknown) {
        return this._http.post<T>(this._createApiUrl(url), data).pipe(timeout(this._config.timeout));
    }

    put<T>(url: string, data: unknown) {
        return this._http.put<T>(this._createApiUrl(url), data).pipe(timeout(this._config.timeout));
    }

    patch<T>(url: string, data: unknown) {
        return this._http.patch<T>(this._createApiUrl(url), data).pipe(timeout(this._config.timeout));
    }

    delete<T>(url: string, data: unknown) {
        return this._http.delete<T>(this._createApiUrl(url)).pipe(timeout(this._config.timeout));
    }
}
