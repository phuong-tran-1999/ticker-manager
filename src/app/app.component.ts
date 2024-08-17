import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@layout/footer';
import { HeaderComponent } from '@layout/header';
import { TicketApiService, UserApiService } from '@shared/data-access';
import { SkeletonComponent } from '@shared/ui/skeleton';

@Component({
    standalone: true,
    imports: [RouterModule, FooterComponent, HeaderComponent, SkeletonComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private _api = inject(TicketApiService);
    private _userApi = inject(UserApiService);

    ngOnInit(): void {
        this._api.search().subscribe((value) => console.log('Search:', value));
        this._api.get(1).subscribe((value) => console.log('Get:', value));

        this._userApi.search().subscribe((value) => console.log('Search:', value));
        this._userApi.get(1).subscribe((value) => console.log('Get:', value));
    }
}
