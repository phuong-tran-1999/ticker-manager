import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@layout/footer';
import { HeaderComponent } from '@layout/header';
import { SkeletonComponent } from '@shared/ui/skeleton';

@Component({
    standalone: true,
    imports: [RouterModule, FooterComponent, HeaderComponent, SkeletonComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'ticker-manager';
}
