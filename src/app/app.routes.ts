import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('@modules/home').then((c) => c.HomeComponent),
        title: 'Ticket Manager',
    },
    {
        path: '**',
        redirectTo: '',
    },
];
