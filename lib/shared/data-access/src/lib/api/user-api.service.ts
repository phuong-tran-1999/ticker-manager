import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared/core';
import { Observable } from 'rxjs';
import { User } from '../interface';

@Injectable({ providedIn: 'root' })
export class UserApiService {
    static ROOT_POINT = '/users';

    private _apiService = inject(ApiService);

    search(query = {}): Observable<User[]> {
        return this._apiService.get(UserApiService.ROOT_POINT, query);
    }

    get(id: number): Observable<User> {
        return this._apiService.get(`${UserApiService.ROOT_POINT}/${id}`);
    }
}
